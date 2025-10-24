import { useEffect, useState, useRef } from "react";
import { useData } from "../../contexts/DataContext";
import { getMonth } from "../../helpers/Date";

import "./style.scss";

const Slider = () => {
  const { data } = useData();
  const [index, setIndex] = useState(0);
  const timeoutRef = useRef(null);

  const byDateDesc = data?.focus?.sort((evtA, evtB) =>
    new Date(evtA.date) < new Date(evtB.date) ? -1 : 1
  );

  const nextCard = () => {
    if (byDateDesc && byDateDesc.length > 0) {
      setIndex((prevIndex) =>
        prevIndex < byDateDesc.length - 1 ? prevIndex + 1 : 0
      );
    }
  };

  const resetTimer = () => {
    // Nettoyer le timer existant
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Démarrer un nouveau timer
    if (byDateDesc && byDateDesc.length > 0) {
      timeoutRef.current = setTimeout(() => {
        nextCard();
      }, 5000);
    }
  };

  useEffect(() => {
    resetTimer();

    // Nettoyer le timer au démontage du composant
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [index, byDateDesc]);

  // Fonction pour gérer le clic sur un bullet point
  const handleBulletClick = (bulletIndex) => {
    setIndex(bulletIndex);
  };

  // Retourner null ou un loader si les données ne sont pas encore chargées
  if (!byDateDesc || byDateDesc.length === 0) {
    return <div className="SlideCardList">Loading...</div>;
  }

  return (
    <div className="SlideCardList">
      {byDateDesc.map((event, idx) => (
        <div
          key={event.cover || idx}
          className={`SlideCard SlideCard--${
            index === idx ? "display" : "hide"
          }`}
        >
          <img src={event.cover} alt="forum" />
          <div className="SlideCard__descriptionContainer">
            <div className="SlideCard__description">
              <h3>{event.title}</h3>
              <p>{event.description}</p>
              <div>{getMonth(new Date(event.date))}</div>
            </div>
          </div>
        </div>
      ))}
      <div className="SlideCard__paginationContainer">
        <div className="SlideCard__pagination">
          {byDateDesc.map((event, radioIdx) => (
            <input
              key={`pagination-${event.cover || radioIdx}`}
              type="radio"
              name="radio-button"
              checked={index === radioIdx}
              onChange={() => handleBulletClick(radioIdx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Slider;
