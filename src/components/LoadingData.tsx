import './LoadingData.css';
import hourglassloader from '../images/hourglassloader.png';

function LoadingData() {
	return (
		<div className="loading-bin">
			<div className="loading-text-bin">
				<h4 className="loading-text">Loading . . . . </h4>
			</div>
			<img
				src={hourglassloader}
				alt=""
				className="loading-animation"
			></img>
		</div>
	);
}

export default LoadingData;
