"use client";
import { useState, useEffect } from "react";
import { debounce } from "@mui/material/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";

import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";

import BookmarkIcon from "@mui/icons-material/Bookmark";

import { DataGrid } from "@mui/x-data-grid";

const columns = [
  {
    field: "name",
    headerName: "Name",
    width: 250,
    editable: true,
  },
  {
    field: "owner",
    headerName: "Owner",
    // sortable: false,
    width: 260,
    valueGetter: (params) => `${params.row.owner.login || ""}`,
  },
  {
    field: "description",
    headerName: "Description",
    // type: "number",
    width: 900,
    editable: true,
  },
  {
    field: "stargazers_count",
    headerName: "Stars",
    width: 100,
    editable: true,
  },
];

export default function HomePage() {
  const storedData = localStorage.getItem("bookMarkedList");
  const [searchData, setSearchData] = useState(JSON.parse(storedData) || []);

  return (
    <Grid container spacing={1}>
      <Grid item xs={12}>
        <Box sx={{ minHeight: 400, width: "100%" }}>
          <DataGrid
            rows={searchData}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 10,
                },
              },
            }}
            pageSizeOptions={[10]}

            // checkboxSelection
            // disableRowSelectionOnClick
          />
        </Box>
      </Grid>
    </Grid>
  );
}
