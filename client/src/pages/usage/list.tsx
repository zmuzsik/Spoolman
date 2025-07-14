import {
    List,
    useTable,
} from "@refinedev/antd";
import { IResourceComponentsProps, useTranslate } from "@refinedev/core";
import { Table } from "antd";
import { ColumnType } from "antd/es/table";
import { useMemo, useState } from "react";
import { SortedColumn, SpoolIconColumn, NumberColumn, DateColumn } from "../../components/column";
import { useCurrencyFormatter } from "../../utils/settings";
import { useNavigate } from "react-router-dom";

interface IFilamentUsage {
    id: number;
    spool_id: number;
    filament_name?: string;
    material?: string;
    date: string;
    used_weight: number;
    used_length?: number;
    cost?: number;
    filament?: {
        vendor?: { name?: string };
        name?: string;
        color_hex?: string;
        multi_color_hexes?: string;
        multi_color_direction?: string;
    };
}

function collapseUsage(element: IFilamentUsage): IFilamentUsage {
    let filament_name = element.filament_name;
    if (element.filament && element.filament.vendor && element.filament.vendor.name) {
        filament_name = `${element.filament.vendor.name} - ${element.filament.name}`;
    }
    return {
        ...element,
        filament_name,
    };
}

const allColumns: (keyof IFilamentUsage & string)[] = [
    "id",
    "filament_name",
    "material",
    "used_weight",
    "used_length",
    "cost",
    "date",
];
const defaultColumns = allColumns;

export const UsageList: React.FC<IResourceComponentsProps> = () => {
    const t = useTranslate();
    const currencyFormatter = useCurrencyFormatter();
    const navigate = useNavigate();

    const { tableProps } = useTable<IFilamentUsage>({
        syncWithLocation: false,
        pagination: {
            mode: "server",
        },
        queryOptions: {
            select(data) {
                return {
                    total: data.length,
                    data: data.map(collapseUsage),
                };
            },
        },
        resource: "usage",
    });

    const [showColumns, setShowColumns] = useState<string[]>(defaultColumns);

    const dataSource: IFilamentUsage[] = useMemo(
        () => (tableProps.dataSource || []).map((record) => ({ ...record })),
        [tableProps.dataSource]
    );

    // Use a proper TableState object for columns
    const tableState = {
        sorters: [],
        filters: [],
        pagination: { current: 1, pageSize: 20 },
        showColumns,
    };
    const commonProps = {
        t,
        dataSource,
        tableState,
        sorter: true,
        navigate,
    };

    // Mock UseQueryResult for filterValueQuery
    const mockFilterValueQuery = {
        data: [],
        isLoading: false as false,
        refetch: async () => Promise.resolve({} as any),
        error: null,
        isError: false as false,
        isLoadingError: false as false,
        isRefetchError: false as false,
        isSuccess: true as true,
        isIdle: false,
        status: "success" as "success",
        failureCount: 0,
        isFetched: true,
        isFetching: false,
        isStale: false,
        isPlaceholderData: false,
        isPreviousData: false,
        isRefetching: false,
        dataUpdatedAt: Date.now(),
        errorUpdatedAt: Date.now(),
        remove: () => {},
        fetchStatus: "idle" as "idle",
        failureReason: null,
        errorUpdateCount: 0,
        isFetchedAfterMount: true,
        isInitialLoading: false,
        isPaused: false,
    };

    return (
        <List>
            <Table
                {...tableProps}
                sticky
                tableLayout="auto"
                scroll={{ x: "max-content" }}
                dataSource={dataSource}
                rowKey="id"
                columns={[
                    SortedColumn({
                        ...commonProps,
                        id: "id",
                        i18ncat: "usage",
                        width: 70,
                    }),
                    SpoolIconColumn({
                        ...commonProps,
                        id: "filament_name",
                        i18nkey: "usage.fields.filament_name",
                        color: (record: IFilamentUsage) =>
                            record.filament?.multi_color_hexes
                                ? {
                                      colors: record.filament.multi_color_hexes.split(","),
                                      vertical: record.filament.multi_color_direction === "longitudinal",
                                  }
                                : record.filament?.color_hex,
                        dataId: "filament_name",
                        filterValueQuery: mockFilterValueQuery,
                    }),
                    SortedColumn({
                        ...commonProps,
                        id: "material",
                        i18ncat: "usage",
                        width: 120,
                    }),
                    NumberColumn({
                        ...commonProps,
                        id: "used_weight",
                        i18ncat: "usage",
                        align: "right",
                        unit: "g",
                        maxDecimals: 0,
                        width: 110,
                    }),
                    NumberColumn({
                        ...commonProps,
                        id: "used_length",
                        i18ncat: "usage",
                        unit: "mm",
                        maxDecimals: 0,
                        width: 120,
                    }),
                    NumberColumn({
                        ...commonProps,
                        id: "cost",
                        i18ncat: "usage",
                        align: "right",
                        unit: "",
                        render: (_: any, obj: IFilamentUsage) =>
                            obj.cost !== undefined ? currencyFormatter.format(obj.cost) : "-",
                        width: 110,
                    }),
                    DateColumn({
                        ...commonProps,
                        id: "date",
                        i18ncat: "usage",
                    }),
                ].filter((col): col is ColumnType<IFilamentUsage> => !!col && typeof col.key === "string" && showColumns.includes(col.key as string))}
            />
        </List>
    );
};

export default UsageList;
