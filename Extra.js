//  // ---------------- Image Picker ----------------
//  const pickImage = async () => {
//   try {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [1, 1],
//       quality: 0.6,
//       base64: true, // ✅ MUST BE TRUE
//     });

//     if (result.canceled) return;

//     const asset = result.assets[0];

//     if (!asset.base64) {
//       alert("Image data missing. Please try again.");
//       return;
//     }

//     const base64 = asset.base64;

//     // Convert Base64 → ArrayBuffer
//     const byteCharacters = atob(base64);
//     const byteNumbers = new Array(byteCharacters.length);
//     for (let i = 0; i < byteCharacters.length; i++) {
//       byteNumbers[i] = byteCharacters.charCodeAt(i);
//     }

//     const fileData = Uint8Array.from(byteNumbers);

//     const fileName = `profile_${Date.now()}.jpg`;

//     const { error: uploadError } = await supabase.storage
//       .from("profile-photos")
//       .upload(fileName, fileData, {
//         contentType: "image/jpeg",
//         upsert: true,
//       });

//     if (uploadError) {
//       console.log("Upload Error:", uploadError);
//       alert("Image upload failed");
//       return;
//     }

//     const { data: publicData } = supabase.storage
//       .from("profile-photos")
//       .getPublicUrl(fileName);

//     setProfilePhoto(publicData.publicUrl);

//   } catch (error) {
//     console.log("Pick Image Error:", error);
//     alert("Something went wrong while uploading the photo");
//   }
// };