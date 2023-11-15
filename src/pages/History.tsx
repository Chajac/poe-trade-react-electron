import { useLiveQuery } from "dexie-react-hooks";
import { db } from "../../db/db";
import {
	Table,
	TableHeader,
	TableBody,
	TableColumn,
	TableRow,
	TableCell,
	getKeyValue,
	Select,
	SelectItem,
} from "@nextui-org/react";
import React, { useMemo, useState } from "react";

type Column = {
	key: React.Key;
	label: string;
};

const initialVisibleColumns = [
	"date",
	"time",
	"sender",
	"item_name",
	"item_icon",
	"item_history_change",
	"price",
	"currency",
	"league",
	"trade_status",
];

const History = () => {
	const [viewableColumns, setViewableColumns] = useState(
		initialVisibleColumns
	);
	//handle custom cells.
	const renderCell = React.useCallback((item: any, columnKey: React.Key) => {
		const cellValue = getKeyValue(item, columnKey);

		switch (columnKey) {
			case "item_icon":
				return (
					<img
						alt="Item Icon"
						height={25}
						src={cellValue}
						width={25}
					/>
				);
			case "currency_icon":
				return (
					<img
						alt="Currency Icon"
						height={25}
						src={cellValue}
						width={25}
					/>
				);
			default:
				return cellValue;
		}
	}, []);
	const tradeDb = useLiveQuery(() => db.trades.toArray());

	function getTableSchema(): Column[] {
		const schema = db.trades.schema;
		const columns = schema.indexes.map((i) => {
			return { key: i.keyPath as React.Key, label: i.name };
		});
		return columns;
	}

	function handleSelectColumnSetting(
		e: React.ChangeEvent<HTMLSelectElement>
	) {
		const collectedValues = e.target.value;
		const splitValues = collectedValues.split(",");

		return setViewableColumns(splitValues);
	}

	const columns = getTableSchema();

	const headerColumns = useMemo(() => {
		return columns.filter((column) =>
			Array.from(viewableColumns).includes(column.label)
		);
	}, [columns, viewableColumns]);

	if (!tradeDb || tradeDb === undefined) {
		return null;
	}

	return (
		<>
			<div className="flex flex-col mx-auto p-4">
				<h1 className="w-1/2 self-start m-4 text-2xl font-bold mb-4 align-center text-center">
					Trade History
				</h1>
				<Select
					selectionMode="multiple"
					className="max-w-xs mb-4"
					label="Table Columns"
					placeholder="Select table columns"
					defaultSelectedKeys={viewableColumns}
					onChange={(e) => handleSelectColumnSetting(e)}
				>
					{columns.map((column) => (
						<SelectItem key={column.key} value={column.label}>
							{column.label}
						</SelectItem>
					))}
				</Select>
				<Table aria-label="Trade History" isStriped>
					<TableHeader columns={headerColumns}>
						{(column) => (
							<TableColumn key={column.key}>
								{column.label}
							</TableColumn>
						)}
					</TableHeader>
					<TableBody items={tradeDb}>
						{(item) => (
							<TableRow key={item}>
								{(columnKey) => (
									<TableCell>
										{renderCell(item, columnKey)}
									</TableCell>
								)}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
		</>
	);
};

export default History;
