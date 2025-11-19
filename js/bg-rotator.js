/* Background rotator for index.html
   - Loads non-ICO images list from /images/images.json
   - Randomly picks an image on start, then every 5 minutes
   - Also switches immediately when a 'trackchange' event is dispatched
*/

(async function(){
    const containerA = document.getElementById('bgA');
    const containerB = document.getElementById('bgB');
    if(!containerA || !containerB) return;

    // load manifest
    let images = [];
    try{
        const resp = await fetch('/images/images.json');
        if(!resp.ok) throw new Error(`HTTP ${resp.status}`);
        images = await resp.json();
    }catch(e){
        console.warn('Could not load images manifest, falling back to default', e);
        // fallback to a default single image if manifest fails
        images = ['Nat Gained Some LOVE.gif'];
    }

    if(!Array.isArray(images) || images.length===0){
        images = ['Nat Gained Some LOVE.gif'];
    }

    let active = containerA;
    let inactive = containerB;

    function setBackground(el, img){
        el.style.backgroundImage = `url('/images/${encodeURIComponent(img)}')`;
    }

    function swapToRandom(){
        const img = images[Math.floor(Math.random()*images.length)];
        // prefetch
        const link = document.createElement('link');
        link.rel = 'prefetch';
        link.href = `/images/${encodeURIComponent(img)}`;
        document.head.appendChild(link);

        setBackground(inactive, img);
        // fade
        inactive.classList.add('visible');
        active.classList.remove('visible');
        // swap refs
        [active, inactive] = [inactive, active];
    }

    // initial
    swapToRandom();

    // on track change -> swap immediately
    window.addEventListener('trackchange', () => {
        swapToRandom();
    });

    // every 5 minutes
    setInterval(swapToRandom, 5*60*1000);
})();
