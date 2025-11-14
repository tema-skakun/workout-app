import {IconProps} from "@/types";

export const Arrow = ({
												width = 24,
												height = 24,
												fill = '#292D32',
											}: IconProps) => (
	<svg
		width={width}
		height={height}
		viewBox="0 0 24 24"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<path fill="#000000"
					d="M17 11H9.414l2.293-2.293a.999.999 0 1 0-1.414-1.414L5.586 12l4.707 4.707a.997.997 0 0 0 1.414 0a.999.999 0 0 0 0-1.414L9.414 13H17a1 1 0 0 0 0-2z"/>
	</svg>
);
