import React from 'react';

function MessageArea({ message }) {
    const { text, type, allowHTML } = message;

    let className = "p-2 text-sm rounded min-h-[40px] border-l-4 transition-all duration-300";    
    switch (type) {
        case "success": className += " message-success"; break;    
        case "error": className += " message-error"; break;    
        case "warning": className += " message-warning"; break;    
        default: className += " ";    
    }

    return (
        <div id="messageArea" className={className} style={{ backgroundColor: 'var(--message-info-bg)', color: 'var(--message-info-text)', borderLeftColor: 'var(--message-info-border)' }}> {/* [cite: 96] */}
            {allowHTML ? <span dangerouslySetInnerHTML={{ __html: text }} /> : <span>{text}</span>} 
        </div>
    );
}

export default MessageArea;




