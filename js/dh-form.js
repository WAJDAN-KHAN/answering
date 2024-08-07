/**
 * Deskhero Form: Represents a custom HTML element for displaying a form within an iframe.
 * @extends HTMLElement
 * @howToUse Add the tag to the body and the script to the bottom of the body.
 * @example 
 * <body>
 *  <dh-form url="https://your-tenant.deskhero.com/external/forms/dynamic"></dh-form>
 * </body>
 * <script src="https://your-tenant.deskhero.com/dh-form.js"></script>
 * 
 * Configurable options <dh-form>
 *  Append floating=true to render it as a floating bubble / message box
 *  Append description-text="my text" to set a text above the form
 *  Append footer-text="my text" to set a text below the form
 * 
 * Configure group to receive the created tickets
 *  Append ?group=your_group on the <dh-form url>
 * 
 * Custom fields
 *  Append ?fields=custom_field1&fields=custom_field2 to set additional fields to the form
 *  
 */
class DhFormComponent extends HTMLElement {
    constructor() {
        super();
        this.attachShadow({ mode: "open" });
    }

    connectedCallback() {
        const url = this.getAttribute("url");
        const floating = this.getAttribute("floating");

        if (floating) {
            const textDescription = this.getAttribute("description-text");
            const textFooter = this.getAttribute("footer-text");
            this.renderFloating(url, textDescription, textFooter);
        } else {
            this.renderOnPage(url);
        }
    }

    renderIframe(url, container) {
        const iframe = document.createElement("iframe");
        const defaultIframeHeight = 100;
        iframe.src = url;
        iframe.style.width = "100%";
        iframe.style.border = "none";
        iframe.style.height = defaultIframeHeight + "px";
        iframe.style.transition = "height 0.1s ease-in-out";
        iframe.style.overflowY = "auto"; // Add vertical scrollbar if needed

        iframe.onload = () => {
            iframe.contentWindow.postMessage("getHeight", "*");
            const loader = container.querySelector('.loader');
            if (loader) {
                loader.style.display = 'none';
            }
        };

        window.addEventListener("message", (event) => {
            if (event.data?.getHeight) {
                const height = event.data.getHeight > defaultIframeHeight ? event.data.getHeight : defaultIframeHeight;
                const recaptchaExtraHeight = 120;
                iframe.style.height = height + recaptchaExtraHeight + "px";
            }
        });

        container.appendChild(iframe);
    }

    renderOnPage(url) {
        this.renderIframe(url, this.shadowRoot);
        window.addEventListener('DOMContentLoaded', (event) => {
            const dhForm = document.querySelector('dh-form');
            if (dhForm) {
                dhForm.style.display = 'block';
            }
        });
    }

    renderFloating(url, textDescription, textFooter) {
        const scriptSrc = DhFormComponent.scriptBaseURL();
        const style = document.createElement('style');
        style.textContent = `
        .chat-bubble {
          position: fixed;
          bottom: 25px;
          right: 25px;
          width: 60px;
          height: 60px;
          background-color: #0f71b4;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          cursor: pointer;
          z-index: 10000;
        }
        .chat-icon, .close-icon {
          width: 30px;
          height: 30px;
        }
        .chat-form-container {
          position: fixed;
          bottom: 65px;
          right: 15px;
          z-index: 10000;
        }
        .chat-form {
          width: 500px;
          max-height: 80vh; 
          background-color: #fff;
          border: 1px solid #ccc;
          border-radius: 10px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          position: relative;
          overflow-y: auto;
          padding: 0;
        }
        .chat-form p {
          font-family: 'Rubik', Arial, Helvetica, sans-serif;
          color: #555555; 
          padding-left: 20px;
          padding-right: 20px;
        }
        @media (max-width: 600px) {
          .chat-form {
            width: calc(100vw - 20px);
            max-width: 100vw;
            max-height: 90vh;
            bottom: 5px;
            right: 5px;
            left: 5px;
            border-radius: 10px;
            padding: 0;
          }
          .chat-form-container {
            bottom: 55px;
            right: 5px;
            left: 5px;
          }
        }
        @media (min-width: 601px) and (max-width: 1200px) {
          .chat-form {
            max-height: 80vh;
          }
        }
        @media (min-width: 1201px) {
          .chat-form {
            max-height: 70vh;
          }
        }
        .loader {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          display: block;
          z-index: 10001; /* Ensure the loader is on top of other content */
        }
      `;
        document.head.appendChild(style);

        const chatBubble = document.createElement('div');
        chatBubble.id = 'chat-bubble';
        chatBubble.className = 'chat-bubble';

        const chatIcon = document.createElement('img');
        chatIcon.src = `${scriptSrc}/dh-form-open.png`;
        chatIcon.alt = 'Message';
        chatIcon.className = 'chat-icon';

        const closeIcon = document.createElement('img');
        closeIcon.src = `${scriptSrc}/dh-form-close.png`;
        closeIcon.alt = 'Close';
        closeIcon.className = 'close-icon';
        closeIcon.style.display = 'none';

        chatBubble.appendChild(chatIcon);
        chatBubble.appendChild(closeIcon);

        document.body.appendChild(chatBubble);

        const chatFormContainer = document.createElement('div');
        chatFormContainer.className = 'chat-form-container';

        const chatForm = document.createElement('div');
        chatForm.id = 'chat-form';
        chatForm.className = 'chat-form';
        chatForm.style.display = 'none';

        chatFormContainer.appendChild(chatForm);
        document.body.appendChild(chatFormContainer);

        chatBubble.addEventListener('click', () => {
            if (chatForm.style.display === 'none') {
                chatForm.style.display = 'block';
                chatIcon.style.display = 'none';
                closeIcon.style.display = 'block';

                if (!chatForm.querySelector('iframe')) {
                    // Inject loader
                    const loader = document.createElement('div');
                    loader.className = 'loader';
                    const loaderImage = document.createElement('img');
                    loaderImage.src = `${scriptSrc}/dh-form-small-loader.gif`;
                    loaderImage.alt = 'Loading...';
                    loader.appendChild(loaderImage);

                    chatForm.appendChild(loader);

                    // Inject text above the form if present
                    if (textDescription) {
                        const aboveText = document.createElement("p");
                        aboveText.textContent = textDescription;
                        chatForm.appendChild(aboveText);
                    }

                    this.renderIframe(url, chatForm);

                    // Inject text below the form if present
                    if (textFooter) {
                        const belowText = document.createElement("p");
                        belowText.textContent = textFooter;
                        chatForm.appendChild(belowText);
                    }
                }
            } else {
                chatForm.style.display = 'none';
                chatIcon.style.display = 'block';
                closeIcon.style.display = 'none';
            }
        });

        window.addEventListener('DOMContentLoaded', () => {
            const dhForm = document.querySelector('dh-form');
            if (dhForm) {
                dhForm.style.display = 'none';
            }
        });
    }

    static scriptBaseURL() {
        const scripts = document.getElementsByTagName('script');
        for (let i = 0; i < scripts.length; i++) {
            const script = scripts[i];
            const src = script.getAttribute('src');
            if (src && src.includes('dh-form.js')) {
                return src.substring(0, src.lastIndexOf('/'));
            }
        }
        return '';
    }
}

customElements.define("dh-form", DhFormComponent);
