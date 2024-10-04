"use client";
import { Box, Button, TablePaginationProps } from "@mui/material";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  DataGrid,
  gridPageCountSelector,
  GridPagination,
  GridRowSpacingParams,
  useGridApiContext,
  useGridSelector,
} from "@mui/x-data-grid";
import { Pagination } from "@mui/material";
import PaginationItem from "@mui/material/PaginationItem";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback } from "react";

// Custom styled pagination for a closer look to the image
function PrevPagination() {
  return (
    <div className="flex items-center px-3">
      <ChevronLeft className="size-5" />
      Prev
    </div>
  );
}

function NextPagination() {
  return (
    <div className="flex items-center px-3">
      Next
      <ChevronRight className="size-5" />
    </div>
  );
}

function TablePagination({
  page,
  onPageChange,
  className,
}: Pick<TablePaginationProps, "page" | "onPageChange" | "className">) {
  const apiRef = useGridApiContext();
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);

  return (
    <Pagination
      className={className}
      variant="outlined"
      shape="rounded"
      size="large"
      count={pageCount + 1}
      page={page + 1}
      onChange={(event, newPage) => {
        onPageChange(event as any, newPage - 1);
      }}
      renderItem={(item) => (
        <PaginationItem
          {...item}
          slots={{
            previous: PrevPagination,
            next: NextPagination,
          }}
          sx={{
            "&.Mui-selected": {
              backgroundColor: "#5625f2", // Selected page background color
              color: "#fff", // Change the text color of the selected item to white
            },
            "&": {
              color: "black", // Change the text color of the selected item to white
              borderRadius: "7px", // Optional: Add border radius to the selected item
              align: "center",
              alignSelf: "center",
              justifyContent: "center",
              flex: 1,
              alignItems: "center",
            },
            "&:hover": {
              backgroundColor: "#c3b8ff", // Optional: Hover effect for pagination items
            },
          }}
        />
      )}
    />
  );
}

function CustomPagination(props: any) {
  return <GridPagination ActionsComponent={TablePagination} {...props} />;
}

export default function MuiGrid({
  data,
  columns,
  clickHandler,
  autoHeight,
  loading,
  rowCount,
  paginationModel,
  search,
  setSearch,
  onPaginationModelChange,
  columnVisibilityModel,
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = window.location.pathname; // Gets the current route

  const handlePaginationChange = (newPaginationModel) => {
    const page = newPaginationModel?.page + 1;
    onPaginationModelChange(newPaginationModel);
    const queryParams = new URLSearchParams(searchParams);
    queryParams.set("page", page.toString()); // Store page as is
    const queryString = queryParams.toString();
    router.push(`${pathname}?${queryString}`, { scroll: false });
  };

  const getRowSpacing = useCallback((params: GridRowSpacingParams) => {
    return {
      top: 5,
    };
  }, []);

  return (
    <Box sx={{ width: "100%" }}>
      <DataGrid
        rows={data}
        scrollbarSize={10}
        rowCount={rowCount}
        columns={columns}
        disableRowSelectionOnClick={true}
        columnHeaderHeight={45}
        loading={loading}
        getRowSpacing={getRowSpacing}
        pageSizeOptions={[10]} // Updated to 10 items per page
        paginationModel={paginationModel}
        rowHeight={40}
        paginationMode="server"
        onPaginationModelChange={handlePaginationChange} // Use custom handler here
        className="w-full !border-white !border-opacity-0"
        pagination
        columnVisibilityModel={{ id: false, ...columnVisibilityModel }}
        autoHeight={true} // Enable autoHeight
        disableColumnMenu={true}
        onRowClick={clickHandler}
        slots={{
          pagination: CustomPagination, // Ensure this is passed here
        }}
        sx={{
          "& .MuiDataGrid-root": {
            border: "none",
          },
          "& .MuiDataGrid-row": {
            border: "none",
            backgroundColor: "white",
            gap: 0.7,
          },
          "& .MuiDataGrid-cell": {
            border: "1px solid rgba(224, 224, 224, 1)",
            borderRadius: "4px",
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#F0F0F0",
            borderBottom: "none",
            borderTopLeftRadius: "6px",
            borderTopRightRadius: "6px",
            fontSize: 12,
          },
          "& .MuiDataGrid-columnSeparator--sideRight": {
            display: "none",
          },
          "& .MuiDataGrid-columnHeaderTitle": {
            fontWeight: "bold",
            color: "#44444F",
            textAlign: "center",
          },
          "& .MuiDataGrid-columnHeader": {
            position: "relative",
            backgroundColor: "#F0F0F0",
            border: "none",
            "& .MuiDataGrid-columnHeaderTitleContainer": {
              justifyContent: "center",
              padding: "0px",
            },
          },
          "& .MuiDataGrid-cell[data-field='refId'], & .MuiDataGrid-cell[data-field='startDate'], & .MuiDataGrid-cell[data-field='endDate'], & .MuiDataGrid-cell[data-field='amount'], & .MuiDataGrid-cell[data-field='bids']":
            {
              textAlign: "center",
              justifyContent: "center",
            },
          "& .MuiDataGrid-cell[data-field='bids']": {
            backgroundColor: "#F0F0F0",
          },
          "& .MuiDataGrid-cell[data-field='bids'], & .MuiDataGrid-cell[data-field='actions']":
            {
              padding: "0px",
              borderWidth: 0,
            },
          "& .MuiDataGrid-cell[data-field='actions']": {
            width: 30,
          },
          "& .MuiDataGrid-footerContainer": {
            backgroundColor: "#F5F7F9", // Your custom background color
            borderColor: "#E2E2EA",
            borderWidth: 1,
            height: 72,
            borderRadius: 1.15,
            justifyContent: "center",
            marginTop: "2%",
          },
          "& .MuiDataGrid-headerContainer": {
            backgroundColor: "#F5F7F9", // Your custom background color
            borderColor: "#E2E2EA",
            borderWidth: 1,
            height: 72,
            borderRadius: 1.15,
            justifyContent: "center",
          },
        }}
      />
    </Box>
  );
}
