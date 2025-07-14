import { useEffect, useState } from "react";
import { Table, Typography } from "antd";
import { useNavigate } from "react-router-dom";
import { getAPIURL } from "../../utils/url";

interface FilamentUsage {
  id: number;
  spool_id: number;
  filament_name?: string;
  material?: string;
  date: string;
  used_weight: number;
  used_length?: number;
  cost?: number;
}

const columns = [
  { title: "Date", dataIndex: "date", key: "date", render: (val: string) => new Date(val).toLocaleString() },
  { title: "Spool ID", dataIndex: "spool_id", key: "spool_id" },
  { title: "Filament", dataIndex: "filament_name", key: "filament_name" },
  { title: "Material", dataIndex: "material", key: "material" },
  { title: "Used Weight", dataIndex: "used_weight", key: "used_weight", render: (val: number) => `${val} g` },
  { title: "Used Length", dataIndex: "used_length", key: "used_length", render: (val?: number) => val ? `${val} mm` : "-" },
  { title: "Cost", dataIndex: "cost", key: "cost", render: (val?: number) => val ? `$${val.toFixed(2)}` : "-" },
];

export default function UsageHistoryPage() {
  const [data, setData] = useState<FilamentUsage[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    fetch(getAPIURL() + "/usage/")
      .then((res) => res.json())
      .then((json) => setData(json))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div style={{ padding: 24 }}>
      <Typography.Title level={2}>Filament Usage History</Typography.Title>
      <Table
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        pagination={{ pageSize: 20 }}
      />
    </div>
  );
}
