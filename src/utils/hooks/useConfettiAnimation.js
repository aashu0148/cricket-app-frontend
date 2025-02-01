import confettiGif from "@/assets/images/confetti.gif";

function useConfettiAnimation(timer = 5000) {
  function playAnimation() {
    const confettiElement = document.createElement("img");

    confettiElement.src = confettiGif;
    confettiElement.alt = "Confetti";
    confettiElement.style.position = "absolute";
    confettiElement.style.top = "50%";
    confettiElement.style.left = "50%";
    confettiElement.style.transform = "translate(-50%, -50%)";
    confettiElement.style.zIndex = "9999999";
    confettiElement.style.pointerEvents = "none";

    document.body.appendChild(confettiElement);

    setTimeout(() => {
      document.body.removeChild(confettiElement);
    }, timer);
  }

  return {
    play: playAnimation,
  };
}

export default useConfettiAnimation;
