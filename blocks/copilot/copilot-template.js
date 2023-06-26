export default function template() {
  return `
    <div class="banner">
        <h3>Spellweaver</h3>
        <span><i class="fa-solid fa-flask-vial" style="color: #a20b0b;"></i></span>
        <em>A Franklin Copilot</em>
        <span><i class="fa-solid fa-flask-vial" style="color: #a20b0b;"></i></span>
    </div>
    <div class="content-wrapper">
        <div class="chat-container">
            <div id="chat-history" class="chat-history"></div>
            <div class="input-container">
                <input type="text" id="message-input" placeholder="Type a message..." autofocus>
                <button id="send-button"><i class="fa-solid fa-wand-magic-sparkles"></i></button>
            </div>
        </div>
        <div class="preview-container">
            <div class="preview-stage">
            </div>
            <div class="preview-actions">
                <button id="copy-button">Copy to Clipboard</button>
                <button id="reset-button">Reset</button>
            </div>
        </div>
    </div>
    <div id="toast-container"></div>
    `;
}
