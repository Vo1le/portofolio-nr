 /* ---------- Réseau de particules ---------- */
    (function() {
      const canvas = document.getElementById('network-canvas');
      const ctx    = canvas.getContext('2d');
      let W, H, nodes, mouse = { x: -9999, y: -9999 };
      const CONFIG = {
        count: 72, radius: 1.4, maxDist: 160, mouseDist: 200,
        speed: 0.28, lineWidth: 0.5, color: '255,255,255',
      };
      function resize() { W = canvas.width = window.innerWidth; H = canvas.height = window.innerHeight; }
      function makeNode() {
        const angle = Math.random() * Math.PI * 2;
        const spd   = CONFIG.speed * (0.4 + Math.random() * 0.6);
        return { x: Math.random()*W, y: Math.random()*H, vx: Math.cos(angle)*spd, vy: Math.sin(angle)*spd, r: CONFIG.radius*(0.6+Math.random()*0.8) };
      }
      function init() { resize(); nodes = Array.from({ length: CONFIG.count }, makeNode); }
      function draw() {
        ctx.clearRect(0, 0, W, H);
        nodes.forEach(n => {
          n.x += n.vx; n.y += n.vy;
          if (n.x < 0) { n.x = 0; n.vx *= -1; } if (n.x > W) { n.x = W; n.vx *= -1; }
          if (n.y < 0) { n.y = 0; n.vy *= -1; } if (n.y > H) { n.y = H; n.vy *= -1; }
          const dx = mouse.x - n.x, dy = mouse.y - n.y, d = Math.sqrt(dx*dx+dy*dy);
          if (d < CONFIG.mouseDist) {
            const f = (1 - d/CONFIG.mouseDist) * 0.012;
            n.vx += dx*f; n.vy += dy*f;
            const spd = Math.sqrt(n.vx*n.vx+n.vy*n.vy);
            if (spd > CONFIG.speed*3) { n.vx=(n.vx/spd)*CONFIG.speed*3; n.vy=(n.vy/spd)*CONFIG.speed*3; }
          }
        });
        for (let i=0;i<nodes.length;i++) {
          for (let j=i+1;j<nodes.length;j++) {
            const a=nodes[i],b=nodes[j],dx=a.x-b.x,dy=a.y-b.y,d=Math.sqrt(dx*dx+dy*dy);
            if (d<CONFIG.maxDist) {
              ctx.beginPath();
              ctx.strokeStyle=`rgba(${CONFIG.color},${(1-d/CONFIG.maxDist)*0.55})`;
              ctx.lineWidth=CONFIG.lineWidth;
              ctx.moveTo(a.x,a.y); ctx.lineTo(b.x,b.y); ctx.stroke();
            }
          }
        }
        nodes.forEach(n => {
          const dx=mouse.x-n.x,dy=mouse.y-n.y,d=Math.sqrt(dx*dx+dy*dy);
          const glow=d<CONFIG.mouseDist?(1-d/CONFIG.mouseDist):0;
          ctx.beginPath();
          ctx.arc(n.x,n.y,n.r+glow*2.5,0,Math.PI*2);
          ctx.fillStyle=`rgba(${CONFIG.color},${0.5+glow*0.5})`; ctx.fill();
        });
        requestAnimationFrame(draw);
      }
      window.addEventListener('resize', init);
      window.addEventListener('mousemove', e => { mouse.x=e.clientX; mouse.y=e.clientY; });
      window.addEventListener('touchmove', e => { mouse.x=e.touches[0].clientX; mouse.y=e.touches[0].clientY; }, { passive:true });
      init(); draw();
    })();

    /* ---------- Année dynamique ---------- */
    const y = new Date().getFullYear();
    document.getElementById('current-year').textContent = y;
    document.getElementById('year-footer').textContent  = y;

    /* ---------- Curseur custom ---------- */
    const cursor     = document.getElementById('cursor');
    const cursorRing = document.getElementById('cursorRing');
    let mx = 0, my = 0, rx = 0, ry = 0;

    document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });

    (function animateCursor() {
      rx += (mx - rx) * 0.12;
      ry += (my - ry) * 0.12;
      cursor.style.left     = mx + 'px';
      cursor.style.top      = my + 'px';
      cursorRing.style.left = rx + 'px';
      cursorRing.style.top  = ry + 'px';
      requestAnimationFrame(animateCursor);
    })();

    /* ---------- Scroll reveal ---------- */
    const revealEls = document.querySelectorAll('.scroll-reveal');
    const observer  = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          observer.unobserve(e.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(el => observer.observe(el));