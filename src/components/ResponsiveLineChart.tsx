import { ResponsiveLine } from "@nivo/line";

const Chart = ({ data }) => (
	<ResponsiveLine
		data={data}
		margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
		xScale={{ type: "point" }}
		yScale={{
			type: "linear",
			min: "auto",
			max: "auto",
			stacked: true,
			reverse: false,
		}}
		yFormat=" >-.2f"
		curve="natural"
		axisTop={null}
		axisLeft={null}
		axisRight={null}
		axisBottom={null}
		enableGridX={false}
		enableGridY={false}
		colors={{ scheme: "category10" }}
		lineWidth={3}
		pointSize={4}
		pointColor={{ theme: "background" }}
		pointBorderWidth={3}
		pointBorderColor={{ from: "serieColor" }}
		pointLabel="y"
		pointLabelYOffset={-12}
		enableArea={false}
		areaOpacity={0.1}
		enableCrosshair={false}
		useMesh={false}
		motionConfig="default"
	/>
);

export default Chart;
