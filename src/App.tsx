import { useEffect, useState } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import type { Artwork } from "./types";

function App() {
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Artwork[]>([]);
  const [totalRecords, setTotalRecords] = useState(0);
  const [loading, setLoading] = useState(false);

  // Store ONLY selected row IDs (important rule)
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  // Fetch ONLY current page data
  const fetchArtworks = async (pageNumber: number) => {
    setLoading(true);

    const response = await fetch(
      `https://api.artic.edu/api/v1/artworks?page=${pageNumber}&limit=10`
    );

    const result = await response.json();

    setRows(result.data);
    setTotalRecords(result.pagination.total);
    setLoading(false);
  };

  useEffect(() => {
    fetchArtworks(page);
  }, [page]);

  // Map selected IDs → rows of CURRENT page only
  const selectedRows = rows.filter((row) => selectedIds.has(row.id));

  return (
    <div style={{ padding: "20px" }}>
      <h2>Art Institute of Chicago – Artworks</h2>
      <p>Selected artworks: <strong>{selectedIds.size}</strong></p>

      <DataTable
        value={rows}
        dataKey="id"
        paginator
        lazy
        rows={10}
        totalRecords={totalRecords}
        loading={loading}
        emptyMessage="No artworks found"
        selection={selectedRows}
        onSelectionChange={(e) => {
          const newSet = new Set<number>();

          (e.value as Artwork[]).forEach((row) => {
            newSet.add(row.id);
          });

          setSelectedIds(newSet);
        }}
        onPage={(e) => setPage(e.page + 1)}
      >
        <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} />
        <Column field="title" header="Title" />
        <Column field="place_of_origin" header="Place of Origin" />
        <Column field="artist_display" header="Artist" />
        <Column field="inscriptions" header="Inscriptions" />
        <Column field="date_start" header="Start Date" />
        <Column field="inscriptions" header="Inscriptions"style={{ maxWidth: "300px", whiteSpace: "normal" }}/>
        <Column field="date_end" header="End Date" />
      </DataTable>
    </div>
  );
}

export default App;
