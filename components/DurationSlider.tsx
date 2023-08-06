import Slider from "react-slider";
import { formatTime } from "@/utils/timeUtils";

interface DurationSliderProps {
  duration?: number;
  currentTime?: number;
  onTimestampChange?: (timestamp: number) => void;
}

const DurationSlider: React.FC<DurationSliderProps> = ({
  duration,
  currentTime,
  onTimestampChange
}) => {
  return (
    <div className="flex items-center justify-between gap-x-2">
      <div className="text-neutral-500/80 text-sm w-[30px]">{formatTime(currentTime!)}</div>
      <Slider
        min={1}
        max={duration}
        step={0.05}
        value={currentTime}
        onChange={onTimestampChange}
        className="w-32 ml-[10px] h-4 flex-grow border border-black rounded-lg"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        ariaLabelledby="slider-label"
      />
      <div className="text-neutral-500/80 text-sm w-[30px]">{formatTime(duration || 0)}</div>
    </div>
  );
};


export default DurationSlider;