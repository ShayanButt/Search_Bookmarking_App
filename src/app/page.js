"use client";
import { useState, useEffect, forwardRef } from "react";
import { debounce } from "@mui/material/utils";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Unstable_Grid2";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import Divider from "@mui/material/Divider";
import { Tooltip, Snackbar } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import MuiAlert from "@mui/material/Alert";
import DirectionsIcon from "@mui/icons-material/Directions";
import { DataGrid } from "@mui/x-data-grid";

export default function HomePage() {
  const [search, setSearch] = useState("");
  const [searchData, setSearchData] = useState([]);
  const [load, setLoad] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (search && search !== "") {
      setLoad(true);
      searchRepo(search).then((res) => {
        setSearchData(res?.items);
        setLoad(false);
      });
    }
  }, [search]);

  const columns = [
    {
      field: "name",
      headerName: "Name",
      width: 250,
      // editable: true,
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
      minWidth: 350,
      resizable: true,
      // maxWidth: 900,
      // width: 900,
    },
    {
      field: "stargazers_count",
      headerName: "Stars",
      width: 100,
    },
    {
      // flex: 0.1,
      field: "operations",
      // minWidth: 200,
      width: 100,
      // headerName: "Operations",
      renderCell: ({ row }) => {
        const [disable, setDisable] = useState(false);
        return (
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Tooltip title="Bookmark">
              <IconButton
                size="small"
                color="primary"
                onClick={() => {
                  const storedData = localStorage.getItem("bookMarkedList");
                  const arr = storedData ? JSON.parse(storedData) : [];
                  arr.push(row);
                  window.localStorage.setItem(
                    "bookMarkedList",
                    JSON.stringify(arr)
                  );
                  setDisable(true);
                  setOpen(true);
                }}
                disabled={disable}
              >
                <BookmarkIcon fontSize="small" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return (
    <>
      <Grid container spacing={1}>
        <Grid item xs={12}>
          <Paper
            component="form"
            sx={{
              // p: "2px 4px",
              mb: 2,
              display: "flex",
              alignItems: "center",
              // width: 400,
            }}
          >
            <InputBase
              fullWidth
              onChange={debounce((e) => {
                setSearch(e.target.value);
              }, 500)}
              sx={{ ml: 1, flex: 1 }}
              placeholder="Search for GitHub repositories by name"
              inputProps={{
                "aria-label": "Search for GitHub repositories by name",
              }}
            />
            <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
            <IconButton type="button" sx={{ p: "10px" }} aria-label="search">
              <SearchIcon />
            </IconButton>
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ minHeight: "400px", width: "100%" }}>
            <DataGrid
              autoHeight
              disableSelectionOnClick
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
              loading={load}
              // checkboxSelection
              disableRowSelectionOnClick
            />
          </Box>
        </Grid>
      </Grid>
      <Snackbar
        open={open}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        autoHideDuration={6000}
        onClose={() => setOpen(false)}
      >
        <Alert severity="success" sx={{ width: "100%" }}>
          Bookmarked!
        </Alert>
      </Snackbar>
    </>
  );
}

const Alert = forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

const searchRepo = async (query) => {
  const url = `https://api.github.com/search/repositories?q=${query}`;
  const response = await fetch(url, {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
};
