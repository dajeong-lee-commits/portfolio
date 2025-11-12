/* https://codepen.io/filipz/pen/NWZVaXb */

import * as THREE from "https://cdn.skypack.dev/three@0.136.0";
import * as dat from "https://cdn.skypack.dev/dat.gui";

let scene, camera, renderer, material, uniforms, gui;
let textCanvas, textCtx, textTexture;

let config = {
    grainStrength: 0.1,
    intensity: 0.9,
    text: "DAJUNG LEE", // ← 문장 교체
    textScale: 0.08,                   // ← 한 줄 문장이라 줄임(화면 짧은 변 * 비율)
    refractAmount: 0.06                // ← 굴절 강도(취향껏 0.03~0.10)
};

function makeTextTexture() {
    // 화면 해상도에 맞춘 캔버스 생성(너무 작지 않게 최소값 보장)
    const w = Math.max(1024, window.innerWidth);
    const h = Math.max(512, window.innerHeight);

    if (!textCanvas) {
        textCanvas = document.createElement("canvas");
        textCtx = textCanvas.getContext("2d");
    }
    textCanvas.width = w;
    textCanvas.height = h;

    // 배경 투명으로 초기화
    textCtx.clearRect(0, 0, w, h);

    // 폰트 크기 계산(짧은 변 기준)
    const sizePx = Math.floor(Math.min(w, h) * config.textScale);

    // 고화질 폰트 렌더링을 위해 약간의 그림자/외곽선(가독성 보조)
    textCtx.font = `800 ${sizePx}px Pretendard, "Cormorant", serif`;
    textCtx.textAlign = "center";
    textCtx.textBaseline = "middle";

    // 얇은 외곽선(선택)
    textCtx.lineWidth = Math.max(1, sizePx * 0.03);
    textCtx.strokeStyle = "rgba(255,255,255,0.35)";
    textCtx.strokeText(config.text, w / 2, h / 2);

    // 본문 채움
    textCtx.fillStyle = "#ffffff";
    textCtx.fillText(config.text, w / 2, h / 2);

    if (!textTexture) {
        textTexture = new THREE.CanvasTexture(textCanvas);
        textTexture.minFilter = THREE.LinearFilter;
        textTexture.magFilter = THREE.LinearFilter;
        textTexture.wrapS = textTexture.wrapT = THREE.ClampToEdgeWrapping;
    } else {
        textTexture.needsUpdate = true;
    }
}

function init() {
    // 필수: shader-root가 실제 DOM에 있어야 함
    const root = document.getElementById("shader-root");
    if (!root) {
        console.error("#shader-root를 찾을 수 없습니다. HTML을 확인해 주세요.");
        return;
    }

    scene = new THREE.Scene();
    camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.setSize(window.innerWidth, window.innerHeight);
    root.appendChild(renderer.domElement);

    // 문장 텍스처 생성
    makeTextTexture();

    uniforms = {
        iTime: { value: 0 },
        iResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
        grainStrength: { value: config.grainStrength },
        intensity: { value: config.intensity },
        u_textTex: { value: textTexture },
        u_refractAmt: { value: config.refractAmount }
    };

    material = new THREE.ShaderMaterial({
        uniforms,
        vertexShader: `
      void main(){ gl_Position = vec4(position, 1.0); }
    `,
        fragmentShader: `
      uniform float iTime;
      uniform vec2  iResolution;
      uniform float grainStrength;
      uniform float intensity;
      uniform sampler2D u_textTex;
      uniform float u_refractAmt;

      #define AA 1.0

      float random(vec2 st){
        return fract(sin(dot(st, vec2(12.9898,78.233))) * 43758.5453123);
      }

      vec3 background(vec3 d){
        float light = dot(d, sqrt(vec3(0.3, 0.5, 0.2)));
        return vec3(max(light * 0.5 + 0.5, 0.0));
      }

      float smin(float d1, float d2){
        const float e=-6.0;
        return log(exp(d1*e)+exp(d2*e))/e;
      }

      float distfunc(vec3 p){
        float l = pow(dot(p.xz, p.xz), 0.8);
        float ripple = p.y + 0.8 + 0.4 * sin(l*3.0 - iTime + 0.5) / (1.0 + l);
        float h1 = -sin(iTime);
        float h2 =  cos(iTime + 0.1);
        float drop = length(p + vec3(0.0, 1.2, 0.0)*h1) - 0.4;
        drop = smin(drop, length(p + vec3(0.1, 0.8, 0.0)*h2) - 0.2);
        return smin(ripple, drop);
      }

      vec3 normal(vec3 p){
        vec2 e = vec2(1.0,-1.0)*0.01;
        return normalize(
          distfunc(p - e.yxx)*e.yxx +
          distfunc(p - e.xyx)*e.xyx +
          distfunc(p - e.xxy)*e.xxy +
          distfunc(p - e.y)  *e.y
        );
      }

      vec4 march(vec3 p, vec3 d){
        vec4 m = vec4(p,0.0);
        for(int i=0;i<50;i++){
          float s = distfunc(m.xyz);
          m += vec4(d,1.0) * s;
          if(s < 0.01 || m.w > 10.0) break;
        }
        return m;
      }

      void main(){
        vec2 frag = gl_FragCoord.xy;
        vec2 res  = iResolution.xy;
        vec2 uv   = frag / res;

        vec3 col = vec3(0.0);
        vec3 pos = vec3(0.05*cos(iTime), 0.1*sin(iTime), -4.0);
        vec3 lig = sqrt(vec3(0.3, 0.5, 0.2));

        for(float x=0.0;x<AA;x++)
        for(float y=0.0;y<AA;y++){
          vec3 ray = normalize(vec3(frag - res/2.0 + vec2(x,y)/AA, res.y));
          vec4 mar = march(pos, ray);
          vec3 nor = normal(mar.xyz);

          // 물을 통과한 굴절 벡터
          vec3 ref = refract(ray, nor, 0.75);

          // '문장'을 물 뒤쪽에 두고 굴절된 좌표로 샘플
          vec2 uvRefr = clamp(uv + ref.xy * u_refractAmt, 0.0, 1.0);
          vec3 bgGrad = background(ref);
          vec4 textS  = texture2D(u_textTex, uvRefr);
          vec3 behind = mix(bgGrad, textS.rgb, textS.a); // 알파로 문장만 합성

          // 하이라이트
          float r = smoothstep(0.8, 1.0, dot(reflect(ray, nor), lig));
          float l = 1.0 - dot(ray, nor);
          vec3 wat = behind + 0.3 * r * l * l;

          // 거리감에 따른 페이드
          float fade = pow(min(mar.w/10.0, 1.0), 0.3);

          // 레이 결과 합성
          vec3 bac = background(ray) * 0.5 + 0.5;
          col += mix(wat, bac, fade);
        }
        col /= AA*AA;

        // 그레인/강도
        float g = random(uv + iTime) * grainStrength;
        col += vec3(g);
        col *= intensity;

        gl_FragColor = vec4(col * col, 1.0);
      }
    `
    });

    scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), material));

    // GUI(원하면 켜서 조정)
    gui = new dat.GUI();
    gui.add(config, "grainStrength", 0, 0.5).onChange(v => uniforms.grainStrength.value = v);
    gui.add(config, "intensity", 0, 2).onChange(v => uniforms.intensity.value = v);
    gui.add(config, "refractAmount", 0.0, 0.12).name("refract")
        .onChange(v => uniforms.u_refractAmt.value = v);
    gui.add(config, "textScale", 0.04, 0.16).onChange(() => { makeTextTexture(); uniforms.u_textTex.value = textTexture; });

    window.addEventListener("resize", onResize);
    onResize();
    animate();
}

function onResize() {
    const w = window.innerWidth, h = window.innerHeight;
    renderer.setSize(w, h);
    uniforms.iResolution.value.set(w, h);

    // 화면 크기 바뀌면 텍스트 캔버스도 재생성
    makeTextTexture();
    uniforms.u_textTex.value = textTexture;
}

function animate() {
    requestAnimationFrame(animate);
    uniforms.iTime.value += 0.01;
    renderer.render(scene, camera);
}

init();