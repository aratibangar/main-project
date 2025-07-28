import { FaGoogleDrive } from "react-icons/fa";
import { Button } from "../ui/button";

export const GoogleDriveUploadButton = ({ onClick }) => (
  <Button variant="outline" onClick={onClick} className="w-full">
    <FaGoogleDrive className="h-4 w-4 mr-2" />
    <span>Sign in with Google Drive</span>
  </Button>
);