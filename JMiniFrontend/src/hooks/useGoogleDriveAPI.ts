import { useToast } from "@/components/ui/use-toast";
import { useGoogleLogin } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";

import { useState } from "react";

interface TokenResponse {
  access_token: string;
  token_type: string;
  scope: string;
  expires_in: number;
}

export const useGoogleDriveAPI = () => {
  const { toast } = useToast();
  const [accessToken, setAccessToken] = useState<string | null>(null);

  async function GoogleDriveLogin(response) {
    try {
      await axios.get("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: {
          Authorization: `${response.token_type} ${response.access_token}`,
        },
      });

      Cookies.set("access_token", response.access_token, { expires: 1 / 24 });

      return 200;
    } catch (error) {
      return 500;
    }
  }

  const GoogleDriveAuth = useGoogleLogin({
    scope: "openid email profile https://www.googleapis.com/auth/drive.file",
    onSuccess: async (tokenResponse: TokenResponse) => {
      try {
        const res = await GoogleDriveLogin(tokenResponse);
        if (res === 200) {
          const token = tokenResponse.access_token;
          setAccessToken(token);
          Cookies.set("access_token", token, { expires: 365 });
          toast({
            title: "Google Drive Connected",
            description: "You can now upload your photos.",
            duration: 3000,
          });
        } else {
          toast({
            variant: "destructive",
            title: "Unable to sign into Google Drive",
            description: "Please put external links in caption.",
            duration: 3000,
          });
        }
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Unable to sign into Google Drive",
          description: "Please put external links in caption.",
          duration: 3000,
        });
      }
    },
    prompt: "consent",
    onError: () =>
      toast({
        variant: "destructive",
        title: "Unable to sign into Google Drive",
        description: "Please put external links in caption.",
        duration: 3000,
      }),
  });

  const searchFolder = async (folderName) => {
    const query = `name='${folderName}' and mimeType='application/vnd.google-apps.folder' and trashed=false`;
    try {
      const response = await fetch(
        `https://www.googleapis.com/drive/v3/files?q=${encodeURIComponent(
          query
        )}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      const result = await response.json();
      if (result.files && result.files.length > 0) {
        return result.files[0].id;
      }
      return null;
    } catch (error) {
      throw error;
    }
  };

  const createFolder = async (folderName) => {
    const metadata = {
      name: folderName,
      mimeType: "application/vnd.google-apps.folder",
    };

    try {
      const response = await fetch(
        "https://www.googleapis.com/drive/v3/files",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(metadata),
        }
      );

      const result = await response.json();
      return result.id;
    } catch (error) {
      throw error;
    }
  };

  const uploadFile = async (file, folderId, type) => {
    // Upload file first
    const metadata = {
      name: file.name,
      mimeType: file.type,
      parents: [folderId],
    };

    const form = new FormData();
    form.append(
      "metadata",
      new Blob([JSON.stringify(metadata)], { type: "application/json" })
    );
    form.append("file", file);

    try {
      const response = await fetch(
        "https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
          body: form,
        }
      );

      const result = await response.json();

      // Make the file public
      await fetch(
        `https://www.googleapis.com/drive/v3/files/${result.id}/permissions`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            role: "reader",
            type: "anyone",
          }),
        }
      );

      // Update state and return the URL
      if (type === "profile") {
        return `https://drive.google.com/thumbnail?authuser=0&sz=w800&id=${result.id}`;
      } else if (type === "cover") {
        return `https://drive.google.com/thumbnail?authuser=0&sz=w1080&id=${result.id}`;
      }
    } catch (error) {
      throw error;
    }
  };

  const resetToken = () => {
    Cookies.remove("access_token");
    setAccessToken(undefined);
  }

  return {
    GoogleDriveAuth,
    GoogleDriveLogin,
    searchFolder,
    createFolder,
    uploadFile,
    resetToken,
    accessToken,
  };
};
