import axios from "axios";
import { toast } from "sonner";
import { useAppSelector } from "../../redux/hooks";
import { currentUserToken } from "../../redux/features/auth/auth.slice";

type TDownloadReportButtonProps = {
  type: "csv" | "pdf";
};

const DownloadReportButton = ({ type }: TDownloadReportButtonProps) => {
  const token = useAppSelector(currentUserToken);

  const handleDownload = async () => {
    if (!token) {
      toast.error("Unauthorized! Please login again.");
      return;
    }
    const url = `${import.meta.env.VITE_API_URL}/api/parcel/export/${type}`;
    try {
      const response = await axios.get(url, {
        responseType: "blob",
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const blob = new Blob([response.data], {
        type: type === "csv" ? "text/csv" : "application/pdf",
      });

      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = type === "csv" ? "parcels.csv" : "parcels.pdf";
      link.click();
      toast.success(`${type.toUpperCase()} downloaded`);
    } catch (error) {
      console.error(error);
      toast.error("Download failed");
    }
  };

  return (
    <button onClick={handleDownload} className="btn btn-primary btn-sm">
      Download {type.toUpperCase()}
    </button>
  );
};

export default DownloadReportButton;
