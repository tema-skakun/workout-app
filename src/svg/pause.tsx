import {IconProps} from "@/types";

export const Pause = ({
												width = 24,
												height = 24,
												fill = '#292D32',
											}: IconProps) => (
	<svg
		width={width}
		height={height}
		viewBox="0 0 26 26"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path fill="#000000"
					d="M7 5c-.551 0-1 .449-1 1v14c0 .551.449 1 1 1h3c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1H7zm9 0c-.551 0-1 .449-1 1v14c0 .551.449 1 1 1h3c.551 0 1-.449 1-1V6c0-.551-.449-1-1-1h-3z"/>
	</svg>
);
