// ==UserScript==
// @name         修改GPT头像
// @namespace    changeChatGPTAvatar
// @version      1.2
// @description  替换ChatGPT里的ai头像
// @author       mei
// @match        https://chatgpt.com
// @match        https://chatgpt.com/c/*
// @icon         https://s3.bmp.ovh/imgs/2024/10/28/9f08b1db7997ec74.png
// @grant        none
// @license MIT
// ==/UserScript==

//头像地址
    //替换冒号内的图片链接。如果你希望使用某张本地图片可以选择上传到图床，并用图床的链接替换它。
    //如果你在https://gravatar.com/设置了你的头像，你可以在gpt页面打开开发者模式，在[元素]界面中按ctrl+F搜索user，
    //其中有一项后面会跟着一个 src = "https://s.gravatar.com/" 开头的链接，该链接指向的就是你在gravatar.com上传的头像。

var linkUser = "https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com"; //你的头像
var linkGpt = "https://www.google.com/s2/favicons?sz=64&domain=chatgpt.com"; //Gpt的头像

//控制单个头像的更换，修改为false时会停用，为true时使用
var processH5 = true; // 是否生成用户头像
var processH6 = true; // 是否更换GPT的图像

(function() {
    'use strict';

    // 图片 URL
    const linkH5 = linkUser; // 替换为您用于 <h5> 的图片链接
    const linkH6 = linkGpt; // 替换为您用于 <h6> 的图片链接

    // 监控 DOM 变化，查找并替换元素
    const observer = new MutationObserver(() => {
        // 处理 <h5> 元素
        if(processH5){
            const userMessages = document.querySelectorAll('h5.sr-only');
            userMessages.forEach(message => {
                if (message.textContent.includes('您说：')) {
                    const userMessageContainer = message.parentNode.querySelector('.mx-auto.flex.flex-1.gap-4.text-base.md\\:gap-5.lg\\:gap-6.md\\:max-w-3xl.lg\\:max-w-\\[40rem\\].xl\\:max-w-\\[48rem\\]');
                    if (userMessageContainer && !userMessageContainer.querySelector('.flex-shrink-0')) {
                        const avatarClone = createAvatarNode(linkH5); // 使用 linkH5 生成头像框
                        userMessageContainer.appendChild(avatarClone); // 插入头像框
                    }
                }
            });
        }
        // 处理 <h6> 元素
        if(processH6){
            const chatGptMessages = document.querySelectorAll('h6.sr-only');
            chatGptMessages.forEach(message => {
                if (message.textContent.includes('ChatGPT 说：')) {
                    const avatar = message.parentNode.querySelector('.flex-shrink-0.flex.flex-col.relative.items-end .gizmo-bot-avatar');
                    if (avatar && !avatar.dataset.replaced) {
                        const img = document.createElement('img');
                        img.src = linkH6;
                        img.alt = 'Custom Avatar';
                        img.style.width = '32px';
                        img.style.height = '32px';
                        img.style.borderRadius = '50%';

                        // 替换原有元素
                        avatar.innerHTML = '';
                        avatar.appendChild(img);
                        avatar.dataset.replaced = true;
                    }
                }
            });
        }
    });

    // 创建头像节点的函数
    const createAvatarNode = (imageUrl) => {
        const avatarNode = document.createElement('div');
        avatarNode.className = 'flex-shrink-0 flex flex-col relative items-end';

        const avatarInner = document.createElement('div');
        avatarInner.className = 'gizmo-bot-avatar flex h-8 w-8 items-center justify-center overflow-hidden rounded-full';

        const innerDiv = document.createElement('div');
        innerDiv.className = 'relative p-0 rounded-sm flex items-center justify-center bg-token-main-surface-primary text-token-text-primary h-8 w-8';

        const img = document.createElement('img');
        img.src = imageUrl;
        img.alt = 'Custom Avatar';
        img.style.width = '32px';
        img.style.height = '32px';
        img.style.borderRadius = '50%';
        img.style.margin = '0';
        img.style.padding = '0';
        img.style.display = 'block';

        // 构建头像结构
        innerDiv.appendChild(img);
        avatarInner.appendChild(innerDiv);
        avatarNode.appendChild(avatarInner);
        return avatarNode;
    };

    // 开始观察
    observer.observe(document.body, { childList: true, subtree: true });
})();

