import React, { useEffect, useState } from 'react';
import './Voice.css';

function Voice() {
    const [text, setText] = useState("");
    const [spokenText, setSpokenText] = useState("");
    const [isWriting, setIsWriting] = useState(false);
    const [voices, setVoices] = useState([]);
    const [selectedVoice, setSelectedVoice] = useState(null);
    const [language, setLanguage] = useState('en-US');
    const [isSpeaking, setIsSpeaking] = useState(false);

    useEffect(() => {
        const loadVoices = () => {
            const allVoices = speechSynthesis.getVoices();
            if (allVoices.length > 0) {
                setVoices(allVoices);
                setSelectedVoice(allVoices[0]);
            }
        };

        if (typeof speechSynthesis !== "undefined") {
            speechSynthesis.onvoiceschanged = loadVoices;
        }
        loadVoices();
    }, []);

    const speakText = () => {
        if (!text.trim()) return alert("Please enter some text.");
        
        if (speechSynthesis.speaking) {
            speechSynthesis.cancel(); // stop previous
        }
        
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.voice = selectedVoice;
        setIsSpeaking(true);
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => {
            setIsSpeaking(false);
            alert("An error occurred during speech synthesis.");
        };
        speechSynthesis.speak(utterance);
    };

    const writeText = () => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (!SpeechRecognition) {
            return alert("Speech Recognition is not supported in this browser.");
        }
        setText("")
        setIsWriting(true);
        const recognition = new SpeechRecognition();
        recognition.lang = language;
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onresult = (event) => {
            const result = event.results[0][0].transcript;
            setSpokenText(result);
            setText(result);
        };

        recognition.onerror = (err) => {
            alert("Speech recognition error: " + err.error);
            setIsWriting(false);
        };

        recognition.onend = () => setIsWriting(false);
        recognition.start();
    };

    const clearFields = () => {
        setText("");
        setSpokenText("");
    };

    const stopSpeaking = () => {
        speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    const copyText =()=> {
        if(!text) return alert("No text for copy!")
        
        navigator.clipboard.writeText(text)
        alert("Text copied successfully")
    }
    return (
        <div className="voice-container">
            <h1>🎤 Text ↔ Speech Converter</h1>

            <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type something or click Speak to convert voice to text..."
            ></textarea>

            <div className="select-group">
                <div>
                    <label>Voice to Listen</label>
                    <select
                        value={selectedVoice?.name}
                        onChange={(e) => setSelectedVoice(voices.find(v => v.name === e.target.value))}
                    >
                        {voices.map((voice, index) => (
                            <option value={voice.name} key={index}>
                                {voice.name} ({voice.lang})
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label>Language to Speak</label>
                    <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                        <option value="en-US">English</option>
                        <option value="hi-IN">Hindi</option>
                        <option value="ur-PK">Urdu</option>
                        <option value="ar-SA">Arabic</option>
                        <option value="es-ES">Spanish</option>
                        <option value="fr-FR">French</option>
                        <option value="de-DE">German</option>
                        <option value="it-IT">Italian</option>
                        <option value="ru-RU">Russian</option>
                        <option value="zh-CN">Chinese</option>
                        <option value="ja-JP">Japanese</option>
                        <option value="ko-KR">Korean</option>
                        <option value="pt-BR">Portuguese</option>
                    </select>
                </div>
            </div>

            <div className="button-group">
                <button
                    onClick={isSpeaking ? stopSpeaking : speakText}
                    className="btn speak"
                    disabled={isWriting}
                >
                    {isSpeaking ? "🛑 Stop Speaking" : "🔊 Listen"}
                </button>

                <button
                    onClick={isWriting ? null : writeText}
                    className="btn write"
                    disabled={isSpeaking}
                >
                    {isWriting ? "🎙️ Listening..." : "✍️ Start Speaking"}
                </button>
                <button onClick={copyText} className='btn write' >Copy</button>
                <button onClick={clearFields} className="btn clear">🧹 Clear</button>
            </div>
        </div>
    );
}

export default Voice;
