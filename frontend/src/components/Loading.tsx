import { faCircleNotch } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const Loading = () => {
  return (
    <div className="loading">
      <FontAwesomeIcon icon={faCircleNotch} spin /> Загрузка...
    </div>
  );
};
