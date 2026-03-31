
    (function(){
  try {
    const canvas = document.getElementById('tesseract-canvas');
    if(!canvas) return;
    if(!canvas.getContext){
      const img = document.createElement('img');
      img.src = 'public/tesseract.png';
      img.className = 'hero-avatar';
      canvas.replaceWith(img);
      return;
    }

    const ctx = canvas.getContext('2d');
    const W = 220, H = 220, cx = W/2, cy = H/2;

    const verts4D = [];
    for(let i=0;i<16;i++){
      verts4D.push([
        (i&1)?1:-1,
        (i&2)?1:-1,
        (i&4)?1:-1,
        (i&8)?1:-1,
      ]);
    }

    const edges = [];
    for(let i=0;i<16;i++)
      for(let j=i+1;j<16;j++)
        if(((i^j)&((i^j)-1))===0 && (i^j)!==0)
          edges.push([i,j]);

    let t = 0;
    let speed = 0.006;
    let targetSpeed = 0.006;
    let animRunning = true;

    canvas.addEventListener('mouseenter', () => targetSpeed = 0.0008);
    canvas.addEventListener('mouseleave', () => targetSpeed = 0.006);

    const observer = new IntersectionObserver((entries) => {
      animRunning = entries[0].isIntersecting;
      if(animRunning) draw();
    }, { threshold: 0.1 });
    observer.observe(canvas);

    function rot4D(v, a1, a2, a3, a4){
      let [x,y,z,w] = v;
      let nx,ny,nz,nw;
      nx=x*Math.cos(a1)-y*Math.sin(a1); ny=x*Math.sin(a1)+y*Math.cos(a1); x=nx; y=ny;
      nz=z*Math.cos(a2)-w*Math.sin(a2); nw=z*Math.sin(a2)+w*Math.cos(a2); z=nz; w=nw;
      nx=x*Math.cos(a3)-z*Math.sin(a3); nz=x*Math.sin(a3)+z*Math.cos(a3); x=nx; z=nz;
      ny=y*Math.cos(a4)-w*Math.sin(a4); nw=y*Math.sin(a4)+w*Math.cos(a4); y=ny; w=nw;
      return [x,y,z,w];
    }

    function project(v){
      const [x,y,z,w] = v;
      const w4 = 1/(2.8-w);
      const x3=x*w4, y3=y*w4, z3=z*w4;
      const z4 = 1/(3.5-z3);
      return [
        cx + x3*z4*300,
        cy + y3*z4*300,
        w4
      ];
    }

    function draw(){
      ctx.clearRect(0,0,W,H);

      ctx.beginPath();
      ctx.arc(cx,cy,W/2,0,Math.PI*2);
      ctx.fillStyle='#02050a';
      ctx.fill();

      speed += (targetSpeed - speed) * 0.04;
      t += speed;

      const proj = verts4D.map(v=>project(rot4D(v, t*0.7, t*0.5, t*0.3, t*0.4)));

      ctx.shadowBlur = 0;
      for(const [a,b] of edges){
        const [x1,y1,d1] = proj[a];
        const [x2,y2,d2] = proj[b];
        const depth = (d1+d2)/2;
        const alpha = 0.2 + depth*0.55;
        ctx.beginPath();
        ctx.moveTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.strokeStyle = `rgba(255,255,255,${Math.min(alpha,0.75)})`;
        ctx.lineWidth = 0.7 + depth*1.1;
        ctx.stroke();
      }

      ctx.shadowColor = '#dfcbc4';
      ctx.shadowBlur = 5;
      for(const [px,py,d] of proj){
        ctx.beginPath();
        ctx.arc(px,py,1+d*1.2,0,Math.PI*2);
        ctx.fillStyle = `rgba(223,203,196,${0.5+d*0.4})`;
        ctx.fill();
      }
      ctx.shadowBlur = 0;

      if(animRunning) requestAnimationFrame(draw);
    }

    draw();

  } catch(e) {
    const canvas = document.getElementById('tesseract-canvas');
    if(canvas){
      const img = document.createElement('img');
      img.src = 'public/tesseract.png';
      img.className = 'hero-avatar';
      canvas.replaceWith(img);
    }
  }
})();
    // Lazy-load terminal iframe only when scrolled into view
    const terminalIframe = document.getElementById('terminal-iframe');
    new IntersectionObserver((entries, observer) => {
    if (entries[0].isIntersecting) {
        terminalIframe.src = 'terminal.html';
        observer.disconnect();
    }
    }, { rootMargin: '200px' }).observe(terminalIframe);

    /* ── Fade-in observer ── */
    const obs = new IntersectionObserver(e => e.forEach(x => { if(x.isIntersecting) x.target.classList.add('visible'); }), { threshold: 0.08 });
    document.querySelectorAll('.fade-in').forEach(el => obs.observe(el));
    setTimeout(() => document.querySelectorAll('#hero .fade-in').forEach(el => el.classList.add('visible')), 100);

    /* ── Active nav on scroll ── */
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-center .nav-link');
    new IntersectionObserver(entries => {
      entries.forEach(e => {
        if(e.isIntersecting){
          navLinks.forEach(l => l.classList.remove('active'));
          const m = document.querySelector(`.nav-center a[href="#${e.target.id}"]`);
          if(m) m.classList.add('active');
        }
      });
    }, { rootMargin: '-40% 0px -55% 0px' }).observe;
    sections.forEach(s => {
      new IntersectionObserver(entries => {
        entries.forEach(e => {
          if(e.isIntersecting){
            navLinks.forEach(l => l.classList.remove('active'));
            const m = document.querySelector(`.nav-center a[href="#${e.target.id}"]`);
            if(m) m.classList.add('active');
          }
        });
      }, { rootMargin: '-40% 0px -55% 0px' }).observe(s);
    });

    /* ── Hamburger ── */
    const hamburger = document.getElementById('hamburger');
    const drawer = document.getElementById('drawer');
    hamburger.addEventListener('click', () => drawer.classList.toggle('open'));
    drawer.querySelectorAll('a').forEach(a => a.addEventListener('click', () => drawer.classList.remove('open')));

    /* ── Typing animation ── */
    const words = [
      'the web.',
      'the world.',
      'scale.',
      'impact.',
      'fun.',
      'production.',
      'research.',
      'defence.',
      'people.',
      'me.',
      'you.',
    ];
    let wi = 0, ci = 0, deleting = false;
    const target = document.getElementById('typing-target');

    async function typeTick() {
      const word = words[wi];
      if (!deleting) {
        target.textContent = word.slice(0, ci + 1);
        ci++;
        if (ci === word.length) {
          await pause(1800);
          deleting = true;
        } else {
          await pause(80 + Math.random() * 40);
        }
      } else {
        target.textContent = word.slice(0, ci - 1);
        ci--;
        if (ci === 0) {
          deleting = false;
          wi = (wi + 1) % words.length;
          await pause(200);
        } else {
          await pause(40 + Math.random() * 20);
        }
      }
      requestAnimationFrame(typeTick);
    }

    function pause(ms) { return new Promise(r => setTimeout(r, ms)); }
    setTimeout(typeTick, 800);
    
    const blob = document.getElementById('blob');
    let tx=0,ty=0,cx=0,cy=0;
    document.addEventListener('mousemove',(e)=>{ tx=e.clientX-350; ty=e.clientY-350; });
    (function ab(){ 
    cx+=(tx-cx)*.04; cy+=(ty-cy)*.04; 
    blob.style.left=cx+'px'; blob.style.top=cy+'px'; 
    requestAnimationFrame(ab);  
    })();