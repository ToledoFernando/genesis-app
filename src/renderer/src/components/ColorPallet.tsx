import { Hue, Saturation, useColor, IColor } from "react-color-palette";
import "react-color-palette/css";

interface IProps {
  className?: string;
  height?: number;
  change: (color: IColor) => void
}

function ColorPallet({change, className, height = 150}: IProps) {
  const [color, setColor] = useColor("#000");

  const handleChangeColor = (c: IColor) => {
    setColor(c)
    change(c)
  }

  return <div className={className + "  mb-6 flex flex-col gap-4 px-4"}>
  <Saturation height={height} color={color} onChange={handleChangeColor} />
  <Hue color={color} onChange={setColor} />
</div>
}

export default ColorPallet;