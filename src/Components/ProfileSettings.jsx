/* eslint-disable react/prop-types */
import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Loader2, User } from "lucide-react";
import { useUser, useUpdateProfile } from "../hooks/useQueries";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import CloudinaryUploadWidget from "./CloudinaryUploadWidget";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Alert, AlertDescription } from "./ui/alert";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Loader } from "./loaders/Loader";

const ProfileSettings = ({ notify }) => {
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  useEffect(() => {
    const checkToken = localStorage.getItem("token");
    if (!checkToken && !isAuthenticated) {
      navigate("/login");
    }
  }, [navigate, isAuthenticated]);

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    profilePicture: "",
    name: "",
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const { data: user, isLoading: userLoading } = useUser();
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || "",
        email: user.email || "",
        profilePicture: user.profilePicture || "",
        name: user.name || "",
      });
      setImagePreview(user.profilePicture || "");
    }
  }, [user]);

  const clearError = useCallback(() => {
    const timer = setTimeout(() => {
      setError("");
    }, 4000);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [error, clearError]);

  // Cloudinary configuration
  const cloudName = import.meta.env.CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.CLOUDINARY_UPLOAD_PRESET;
  const [secureUrl, setSecureUrl] = useState("");

  const imgUrl = secureUrl;

  // Upload Widget Configuration
  const uwConfig = {
    cloudName,
    uploadPreset,
    cropping: true,
    maxImageFileSize: 2000000,
    // showAdvancedOptions: true,
  };

  const handleImageChange = useCallback(() => {
    setFormData((prev) => ({
      ...prev,
      profilePicture: imgUrl,
    }));
    setImagePreview(imgUrl);
  }, [imgUrl]);

  const imageRef = useRef(null);

  useEffect(() => {
    if (imgUrl && imageRef.current !== imgUrl) {
      imageRef.current = imgUrl;
      handleImageChange(imgUrl);
    }
  }, [imgUrl, handleImageChange]);

  const updateProfileMutation = useUpdateProfile();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (user?.isVerified == false) {
        throw new Error("You need to verify your email to edit your profile");
      }
      if (!formData.username.trim()) {
        throw new Error("Username is required");
      }
      if (!formData.email.trim()) {
        throw new Error("Email is required");
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        throw new Error("Invalid email format");
      }

      // Only send changed fields
      const changedFields = {};
      if (formData.username !== user.username) {
        changedFields.username = formData.username;
      }
      if (formData.email !== user.email) {
        changedFields.email = formData.email;
      }
      if (formData.profilePicture !== user.profilePicture) {
        changedFields.profilePicture = formData.profilePicture;
      }
      if (formData.name !== user.name) {
        changedFields.name = formData.name;
      }

      if (Object.keys(changedFields).length === 0) {
        notify("No changes detected", "info");
        setIsSubmitting(false);
        return;
      }

      await updateProfileMutation.mutateAsync(changedFields);

      notify("Profile updated successfully", "success");
    } catch (error) {
      setError(error.message);
      notify(error.message, "error");
      setImagePreview(user?.profilePicture || "");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (userLoading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen md:ml-72 mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Profile Settings</CardTitle>
          <CardDescription>
            Update your profile information and email preferences
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-24 w-24">
                  {imagePreview && (
                    <AvatarImage src={imagePreview} alt="Profile" />
                  )}
                  <AvatarFallback>
                    <User className="h-12 w-12" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label
                    htmlFor="picture"
                    className="absolute bottom-0 right-0 p-1 bg-primary text-primary-foreground rounded-full cursor-pointer hover:bg-primary/90 transition-colors"
                  >
                    <CloudinaryUploadWidget
                      uploadConfig={uwConfig}
                      getSecureUrl={setSecureUrl}
                    />
                  </Label>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Click the camera icon to update your profile picture
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, username: e.target.value }))
                }
                placeholder="Enter your username"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, email: e.target.value }))
                }
                placeholder="Enter your email"
              />
            </div>

            <div className="space-y-2">
              <Label
                htmlFor="name"
                className={user?.name ? "text-muted-foreground" : ""}
              >
                Name
                {!user?.name && (
                  <span className="text-sm text-muted-foreground ml-2">
                    (Optional)
                  </span>
                )}
              </Label>
              <Input
                id="name"
                value={formData.name}
                disabled={!!user?.name}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Enter your name"
                className={user?.name ? "bg-muted" : ""}
              />
              {user?.name && (
                <p className="text-sm text-muted-foreground">
                  Name cannot be changed once set
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : null}
              {isSubmitting ? "Updating..." : "Save Changes"}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProfileSettings;
