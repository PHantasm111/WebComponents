// 创建一些常量和变量来设置动画出现的事件频率等
// 定义鼠标移动多少距离才会出现一个emoji
const mouseDistance = 400;

// 定义一个emoji存在的时间
const emojiWaitTime = 500;

// 定义emoji会再过多久之后掉落
const emojiFallDelay = 200;

// 定义emoji的旋转角度
const emojiRotation = [90, -90];

// 定义emoji的大小
const emojiSizes = [150, 200, 250, 300];

// 定义emoji的总数
const totalEmojiVariants = 8;

// 定义一个loading状态
let isLoading = true;

// 定义最后的鼠标x坐标
let lastMouseX = 0;

// 定义最后的鼠标y坐标
let lastMouseY = 0;

// 定义最后一个emoji创建时候的时间戳
let lastEmojiTime = 0;

/*  
    这个JavaScript函数接受一个CSS选择器作为参数。
    它选择所有匹配该选择器的元素，并将每个元素的文本内容拆分成单个字符。
    然后，它将每个字符包裹在一个<span>元素中，空格字符被包裹在&nbsp;&nbsp;中。
    最后，它将生成的HTML字符串设置为原始元素的innerHTML。
    这个函数通常用于样式化文本中的个别字符，例如使标题中的每个字符具有不同的颜色或大小。
*/
function splitTextIntoSpans(selector) {
    let elements = document.querySelectorAll(selector);
    elements.forEach(element => {
        let text = element.innerText;
        let splitText = text.split("").map(function (char) {
            return `<span>${char === " " ? "&nbsp;&nbsp;" : char}</span>`;
        }).join("");

        element.innerHTML = splitText;
    })
}

splitTextIntoSpans(".header h1");

gsap.to(".preloader", {
    clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
    duration: 1.5,
    delay: 5,
    ease: "power4.inOut",
})

gsap.to(".loader", {
    rotation: "+=180",
    duration: 1.5,
    delay: 1,
    repeat: 1,
    ease: "power4.inOut",
    onComplete: () => {
        gsap.to(".loader", {
            scale: 0,
            duration: 2,
            ease: "power4.inOut",
            onComplete: initializePageAnimations,
        })
    }
})

function initializePageAnimations() {
    isLoading = false;

    const timeline = gsap.timeline();

    document.querySelectorAll(".header-row").forEach(row => {
        timeline.to(row.querySelectorAll("span"),
            {
                y: 0,
                duration: 1,
                ease: "power4.out",
                stagger: {
                    amount: 0.25,
                    from: "start"
                },
            },
            0
        );
    });

    timeline.to(".hero-img", {
        scale: 1,
        duration: 1.5,
        ease: "power4.out",
    }, 0).to("hero-img", {
        rotation: 360,
        duration: 20,
        ease: "none",
        repeat: -1,
    }, 0)
};

function createEmoji(mouseX, mouseY) {
    const emoji = document.createElement("div");

    const size = emojiSizes[Math.floor(Math.random() * emojiSizes.length)];

    const emojiVariant = Math.floor(Math.random() * totalEmojiVariants) + 1;

    emoji.className = "emoji";
    emoji.style.width = `${size}px`;
    emoji.style.height = `${size}px`;
    emoji.style.backgroundImage = `url("./assets/emoji-${emojiVariant}.svg")`;
    emoji.style.left = `${mouseX - size / 2}px`;
    emoji.style.top = `${mouseY - size / 2}px`;

    document.querySelector(".emojis").appendChild(emoji);

    const initialRotation =
        emojiRotation[Math.floor(Math.random() * emojiRotation.length)];

    const timeline = gsap.timeline();

    const currentTime = Date.now();
    const delayFromLast =
        Math.max(0, emojiFallDelay - (currentTime - lastEmojiTime)) / 1000;

    gsap.set(emoji, {
        scale: 0,
        rotation: initialRotation,
    });

    timeline.to(emoji, {
        scale: 1,
        rotation: 0,
        duration: 0.5,
        ease: "back.out(1.75)",
    }).to(emoji, {
        y: window.innerHeight + size,
        rotation: initialRotation,
        duration: 0.5,
        ease: "power2.in",
        delay: emojiWaitTime / 1000 + delayFromLast,
        onComplete: () => emoji.remove(),
    })
}

document.addEventListener("mousemove", (e) => {
    if (!isLoading) return;

    const distance = Math.sqrt(
        Math.pow(e.clientX - lastMouseX, 2) + Math.pow(e.clientY - lastMouseY, 2)
    );

    if (distance > mouseDistance) {
        lastEmojiTime = createEmoji(e.clientX, e.clientY);
        lastMouseX = e.clientX;
        lastMouseY = e.clientY;
    }
})