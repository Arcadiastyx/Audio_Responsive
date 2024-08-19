import React, { useEffect, useRef, useState } from 'react';

const AudioResponsiveCircle = () => {
  // Déclare un état local pour gérer le rayon du cercle
  const [radius, setRadius] = useState(50);  // Valeur initiale du rayon à 50
  
  // Utilisation de useRef pour créer des références à des objets audio qui persistent au travers des rendus
  const audioContext = useRef(null);
  const analyser = useRef(null);
  const dataArray = useRef(null);
  const source = useRef(null);

  // useEffect pour démarrer l'audio lorsque le composant est monté
  useEffect(() => {
    const initAudio = async () => {
      try {
        // Demande l'accès à l'audio du microphone
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        
        // Crée un contexte audio pour analyser le flux audio
        audioContext.current = new (window.AudioContext || window.webkitAudioContext)();
        
        // Crée un analyseur de fréquence à partir du contexte audio
        analyser.current = audioContext.current.createAnalyser();
        
        // Crée une source audio à partir du flux de microphone
        source.current = audioContext.current.createMediaStreamSource(stream);
        
        // Connecte la source à l'analyseur
        source.current.connect(analyser.current);
        
        // Définit la taille du FFT (Fast Fourier Transform), affectant la résolution des données de fréquence
        analyser.current.fftSize = 256;
        
        // Calcule la longueur du tableau de données basé sur la taille FFT
        const bufferLength = analyser.current.frequencyBinCount;
        
        // Initialise un tableau pour stocker les données de fréquence audio
        dataArray.current = new Uint8Array(bufferLength);

        // Fonction pour mettre à jour le rayon du cercle en fonction des données de fréquence audio
        const updateRadius = () => {
          // Remplit dataArray avec les données de fréquence actuelles
          analyser.current.getByteFrequencyData(dataArray.current);
          
          // Calcule la moyenne des valeurs dans dataArray
          const average = dataArray.current.reduce((a, b) => a + b) / bufferLength;
          
          // Met à jour le rayon en fonction de la moyenne calculée
          setRadius(50 + average / 2);
          
          // Demande le prochain rafraîchissement d'animation pour continuellement mettre à jour le rayon
          requestAnimationFrame(updateRadius);
        };
        
        // Lance la première mise à jour du rayon
        updateRadius();
      } catch (error) {
        console.error('Error accessing audio stream:', error);
      }
    };

    // Initialise l'audio lors du montage du composant
    initAudio();

    // Nettoie l'audio context lors du démontage du composant
    return () => {
      if (audioContext.current) {
        audioContext.current.close();
      }
    };
  }, []);

  return (
    <div className="flex items-center justify-center h-screen">
      <svg width="300" height="300" viewBox="0 0 300 300">
        {/* Le rayon du cercle est dynamique, basé sur l'état 'radius' */}
        <circle cx="150" cy="150" r={radius} fill="white" />
      </svg>
    </div>
  );
};

export default AudioResponsiveCircle;