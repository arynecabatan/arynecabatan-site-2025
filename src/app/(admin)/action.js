"use server";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import sharp from "sharp";

export async function login(formData) {
  const supabase = await createClient();

  const data = {
    email: formData.get("email"),
    password: formData.get("password"),
  };

  const { error } = await supabase.auth.signInWithPassword(data);

  if (error) {
    return redirect("/admin-login?message=Could not authenticate user");
  }

  revalidatePath("/", "layout");
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Error signing out:", error);
    return redirect("/admin?message=Could not sign out");
  }

  return redirect("/admin-login");
}

const parseTags = (tagsString) => {
  if (!tagsString) return [];
  return tagsString
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter((tag) => tag); // Cleans up spaces and empty entries
};

// --- DESIGN PORTFOLIO PROJECTS ---

export async function createProjectAction(formData) {
  const supabase = await createClient();

  const projectDetails = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    url: formData.get("url"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished") === "true",
    tags: parseTags(formData.get("tags")), // Use the helper function
    stack: parseTags(formData.get("stack")), // Use the helper function
  };
  const coverImageFile = formData.get("coverImage");

  if (!projectDetails.slug || !coverImageFile || coverImageFile.size === 0) {
    return { success: false, message: "Slug and cover image are required." };
  }

  try {
    const fileName = `${projectDetails.slug}-cover.jpg`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("projects")
      .upload(`cover/${fileName}`, coverImageFile, { upsert: true });

    if (uploadError) {
      throw new Error(`Image Upload Failed: ${uploadError.message}`);
    }

    const { error: dbError } = await supabase
      .from("projects")
      .insert({ ...projectDetails, cover_image: uploadData.path });

    if (dbError) {
      throw new Error(`Database Insert Failed: ${dbError.message}`);
    }

    revalidatePath("/admin");
  } catch (error) {
    console.error("Create Project Failed:", error);
    return { success: false, message: error.message };
  }

  redirect("/admin");
}

export async function updateProjectAction(projectId, formData) {
  const supabase = await createClient();

  const projectDetails = {
    title: formData.get("title"),
    slug: formData.get("slug"),
    subtitle: formData.get("subtitle"),
    url: formData.get("url"),
    content: formData.get("content"),
    isPublished: formData.get("isPublished") === "true",
    tags: parseTags(formData.get("tags")),
    stack: parseTags(formData.get("stack")),
  };

  const newCoverImageFile = formData.get("coverImage");
  const currentImagePath = formData.get("currentImagePath");
  let imagePath = currentImagePath;

  try {
    if (newCoverImageFile && newCoverImageFile.size > 0) {
      const fileName = `${projectDetails.slug}-cover-${Date.now()}.jpg`;
      const filePath = `cover/${fileName}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("projects")
        .upload(filePath, newCoverImageFile, { upsert: false });

      if (uploadError) {
        throw new Error(`Image Upload Failed: ${uploadError.message}`);
      }

      imagePath = uploadData.path;

      if (currentImagePath) {
        const { error: removeError } = await supabase.storage
          .from("projects")
          .remove([currentImagePath]);

        if (removeError) {
          console.warn("Could not remove old image:", removeError.message);
        }
      }
    }

    const { error: dbError } = await supabase
      .from("projects")
      .update({ ...projectDetails, cover_image: imagePath })
      .eq("id", projectId);

    if (dbError) throw new Error(dbError.message);

    revalidatePath("/admin");
    revalidatePath("/admin/01-design-portfolio");
    revalidatePath(
      `/admin/01-design-portfolio/edit-design-project/${projectDetails.slug}`
    );
    revalidatePath("/design");
  } catch (error) {
    console.error("Update Project Failed:", error);
    return { success: false, message: error.message };
  }

  redirect("/admin");
}

export async function deleteProject(projectId, imagePath) {
  const supabase = await createClient();
  try {
    const { error: imageError } = await supabase.storage
      .from("projects")
      .remove([imagePath]);
    if (imageError) {
      console.error("Storage Delete Warning:", imageError.message);
    }
    const { error: dbError } = await supabase
      .from("projects")
      .delete()
      .eq("id", projectId);
    if (dbError) {
      throw new Error(`Database Delete Failed: ${dbError.message}`);
    }
    revalidatePath("/admin");
    return { success: true, message: "Project deleted successfully." };
  } catch (error) {
    console.error("Delete Project Failed:", error);
    return { success: false, message: error.message };
  }
}

export async function togglePublishStatus(projectId, currentState) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ isPublished: !currentState })
    .eq("id", projectId);

  if (error) {
    console.error("Error updating publish status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/design");

  return { success: true };
}

export async function toggleProjectHighlightStatus(projectId, currentState) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("projects")
    .update({ is_highlighted: !currentState })
    .eq("id", projectId);

  if (error) {
    console.error("Toggle Project Highlight Error:", error.message);
    return { success: false, message: "Could not update highlight status." };
  }

  revalidatePath("/admin/design-portfolio");
  revalidatePath("/design");
  return { success: true };
}

// --- GALLERY ---

export async function deleteGalleryItem(itemId, baseFilename) {
  const supabase = await createClient();

  // 2. Reconstruct the full paths to both the image and the thumbnail
  const fullPath = `full/${baseFilename}`;
  const thumbPath = `thumbnails/${baseFilename}`;

  const pathsToRemove = [fullPath, thumbPath];

  // 3. Tell Supabase to remove both files from storage
  const { error: storageError } = await supabase.storage
    .from("gallery")
    .remove(pathsToRemove);

  if (storageError) {
    console.error("Storage Delete Error:", storageError.message);
    return { success: false, message: "Could not delete images from storage." };
  }

  // Delete the row from the database (this part is unchanged)
  const { error: dbError } = await supabase
    .from("gallery")
    .delete()
    .eq("id", itemId);

  if (dbError) {
    return { success: false, message: "Could not delete item from database." };
  }

  revalidatePath("/admin/02-gallery-showcase");
  return { success: true };
}

export async function toggleGalleryStatus(itemId, newStatus) {
  const supabase = await createClient();
  console.log(`Server received request to set status to: ${newStatus}`);

  const { data, error } = await supabase
    .from("gallery")
    .update({ status: newStatus })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    return { success: false, message: `Supabase Error: ${error.message}` };
  }

  revalidatePath("/admin/02-gallery-showcase");
  return { success: true, updatedItem: data };
}

export async function toggleHighlightStatus(itemId, currentState) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("gallery")
    .update({ is_highlighted: !currentState })
    .eq("id", itemId)
    .select()
    .single();

  if (error) {
    console.error("Toggle Highlight Error:", error.message);
    return { success: false, message: "Could not update highlight status." };
  }

  revalidatePath("/admin/02-gallery-showcase");
  return { success: true };
}

export async function createGalleryItem(prevState, formData) {
  const supabase = await createClient();

  const itemDetails = {
    title: formData.get("title"),
    type: formData.get("type"),
    status: formData.get("status") === "on",
  };
  const imageFile = formData.get("image");

  if (
    !itemDetails.title ||
    !itemDetails.type ||
    !imageFile ||
    imageFile.size === 0
  ) {
    return { success: false, message: "Image, title, and type are required." };
  }

  const galleryid = itemDetails.title.toLowerCase().replace(/\s+/g, "-");

  let fullPath, thumbPath;

  try {
    const fileExt = imageFile.name.split(".").pop();
    const fileName = `${galleryid}-${Date.now()}.${fileExt}`;

    let width, height;

    if (fileExt.toLowerCase() === "svg") {
      fullPath = `full/${fileName}`;
      thumbPath = `thumbnails/${fileName}`;

      await supabase.storage.from("gallery").upload(fullPath, imageFile);
      await supabase.storage.from("gallery").upload(thumbPath, imageFile);

      width = 1920;
      height = 1920;
    } else {
      const imageBuffer = Buffer.from(await imageFile.arrayBuffer());

      fullPath = `full/${fileName}`;
      const thumbBaseName = `${galleryid}-${Date.now()}.jpg`;
      thumbPath = `thumbnails/${thumbBaseName}`;

      await supabase.storage.from("gallery").upload(fullPath, imageFile);

      const thumbBuffer = await sharp(imageBuffer)
        .resize(400, 400, { fit: "inside" })
        .jpeg({ quality: 90 })
        .toBuffer();
      await supabase.storage
        .from("gallery")
        .upload(thumbPath, thumbBuffer, { contentType: "image/jpeg" });

      const metadata = await sharp(imageBuffer).metadata();
      width = metadata.width;
      height = metadata.height;
    }

    const { error: dbError } = await supabase.from("gallery").insert({
      title: itemDetails.title,
      galleryid: galleryid,
      image: fileName,
      type: itemDetails.type,
      status: itemDetails.status,
      width: width,
      height: height,
    });

    if (dbError) throw new Error(`Database Insert Failed: ${dbError.message}`);
  } catch (error) {
    console.error("Create Gallery Item Failed:", error.message);
    if (fullPath || thumbPath) {
      await supabase.storage
        .from("gallery")
        .remove([fullPath, thumbPath].filter(Boolean));
    }
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/02-gallery-showcase");
  redirect("/admin/02-gallery-showcase");
}

// --- SITE SETTINGS ---

export async function createSiteSetting(formData) {
  const supabase = await createClient();

  const label = formData.get("label");
  const formattedKey = label.toLowerCase().replace(/\s+/g, "_");

  const newSetting = {
    key: formattedKey,
    value: formData.get("value"),
    label: label,
    category: formData.get("category"),
  };

  if (!newSetting.key || !newSetting.label) {
    return { success: false, message: "Label is required." };
  }

  const { error } = await supabase.from("site_settings").insert(newSetting);
  if (error) {
    return { success: false, message: `Database Error: ${error.message}` };
  }

  revalidatePath("/admin/04-site-settings");
  return { success: true };
}

export async function updateSiteSetting(key, newValue) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .update({ value: newValue })
    .eq("key", key);

  if (error) {
    return { success: false, message: `Database Error: ${error.message}` };
  }

  revalidatePath("/admin/04-site-settings");
  return { success: true };
}

export async function deleteSiteSetting(key) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("site_settings")
    .delete()
    .eq("key", key);

  if (error) {
    return { success: false, message: `Database Error: ${error.message}` };
  }

  revalidatePath("/admin/04-site-settings");
  return { success: true };
}

// --- NOTES & EXPERIMENT ---

export async function createBlogAction(formData) {
  const supabase = await createClient();

  const title = formData.get("title");
  const summary = formData.get("summary");
  const content = formData.get("content");
  const reading_time = formData.get("reading_time");
  const slug = title.toLowerCase().replace(/\s+/g, "_");
  const is_published = formData.get("is_published");
  const is_highlighted = formData.get("is_highlighted");
  const tags = parseTags(formData.get("tags"));
  const category = parseTags(formData.get("category"));


  const blogDetails = {
    title: title,
    summary: summary,
    content: content,
    is_published: is_published,
    is_highlighted: is_highlighted,
    tags: tags,
    category: category,
    reading_time: reading_time,
    slug: slug,
  };
  const coverImageFile = formData.get("cover_image");

  if (!blogDetails.slug || !coverImageFile || coverImageFile.size === 0) {
    return { success: false, message: "Slug and cover image are required." };
  }

  try {
    const fileName = coverImageFile ? 'NO COVER IMAGE' : `${blogDetails.slug}-cover-${Date.now()}.jpg` ; 
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("blog-post")
      .upload(`cover/${fileName}`, coverImageFile, { upsert: true });
    if (uploadError) {
      throw new Error(`Image Upload Failed: ${uploadError.message}`);
    }
    const { error: dbError } = await supabase
      .from("blog_post")
      .insert({ ...blogDetails, cover_image: fileName });

    if (dbError) {
      throw new Error(`Database Insert Failed: ${dbError.message}`);
    }
    revalidatePath("/admin");
  } catch (error) {
    console.error("Create Blog Failed:", error);
    return { success: false, message: error.message };
  }
  redirect("/admin/03-notes-and-experiments");
}

export async function updateBlogAction(blogId, prevState, formData) {
  const supabase = await createClient();

  const blogDetails = {
    title: formData.get("title"),
    summary: formData.get("summary"),
    content: formData.get("content"),
    is_published: formData.get("is_published") === 'true',
    is_highlighted: formData.get("is_highlighted") === 'true',
    tags: parseTags(formData.get("tags")),
    category: parseTags(formData.get("category")),
    reading_time: formData.get("reading_time"),
    slug: formData.get("title")
  .toLowerCase()
  .replace(/[^a-z0-9\s-]/g, '') // 1. Remove all non-alphanumeric characters except spaces and hyphens
  .replace(/\s+/g, "-")          // 2. Replace spaces with hyphens
  .replace(/-+/g, "-"),
  };

  const newCoverImageFile = formData.get("cover_image");
  const currentImagePath = formData.get("currentImagePath");
  let imagePath = currentImagePath;

  try {
    if (newCoverImageFile && newCoverImageFile.size > 0) {
      const fileName = `${blogDetails.slug}-cover-${Date.now()}.jpg`;
      const filePath = `cover/${fileName}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("blog-post")
        .upload(filePath, newCoverImageFile, { upsert: false });

      if (uploadError) {
        throw new Error(`Image Upload Failed: ${uploadError.message}`);
      }

      imagePath = fileName;

      if (currentImagePath) {
        await supabase.storage
          .from("blog-post")
          .remove([currentImagePath]);
      }
    }

    console.log("imagePath " + imagePath)

    const { error: dbError } = await supabase
      .from("blog_post")
      .update({ ...blogDetails, cover_image: imagePath })
      .eq("id", blogId);

    if (dbError) throw new Error(`Database Update Failed: ${dbError.message}`);

    // Revalidate all relevant paths
    revalidatePath("/admin/03-notes-and-experiments");
    revalidatePath(`/admin/03-notes-and-experiments/edit-blog-post/${blogDetails.slug}`);
    revalidatePath("/blog");
    revalidatePath(`/blog/${blogDetails.slug}`);

  } catch (error) {
    console.error("Update Blog Failed:", error);
    return { success: false, message: error.message };
  }

  redirect("/admin/03-notes-and-experiments");
}

export async function deleteBlog(blogId, imagePath) {
  const supabase = await createClient();
  try {
    const { error: imageError } = await supabase.storage
      .from("blog-post")
      .remove([imagePath]);
    if (imageError) {
      console.error("Storage Delete Warning:", imageError.message);
    }
    const { error: dbError } = await supabase
      .from("blog_post")
      .delete()
      .eq("id", blogId);
    if (dbError) {
      throw new Error(`Database Delete Failed: ${dbError.message}`);
    }
    revalidatePath("/admin");
    return { success: true, message: "Blog deleted successfully." };
  } catch (error) {
    console.error("Delete Blog Failed:", error);
    return { success: false, message: error.message };
  }
}

export async function toggleBlogPublishStatus(blogId, currentState) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blog_post")
    .update({ is_published: !currentState })
    .eq("id", blogId);

  if (error) {
    console.error("Error updating publish status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin");
  revalidatePath("/blog");

  return { success: true };
}

export async function toggleBlogHighlightStatus(blogId, currentState) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("blog_post")
    .update({ is_highlighted: !currentState })
    .eq("id", blogId);

  if (error) {
    console.error("Toggle Blog Highlight Error:", error.message);
    return { success: false, message: "Could not update highlight status." };
  }

  revalidatePath("/admin");
  revalidatePath("/blog");
  return { success: true };
}

// --- PRYNTS ---

export async function createPryntAction(formData) {
  const supabase = await createClient();

  // 1. Get Album Details and Files from FormData
  const albumCoverFile = formData.get("album_cover");
  const imageFiles = formData.getAll("images");
  const pryntDetails = {
    album_id: formData.get("album_id"),
    title: formData.get("title"),
    description: formData.get("description"),
    isPublished: formData.get("isPublished") === "on",
    isOriginal: formData.get("isOriginal") === "on",
    tags: parseTags(formData.get("tags")),
    category: formData.get("category"),
  };

  // 2. Validate required fields
  if (!pryntDetails.album_id || !albumCoverFile || albumCoverFile.size === 0) {
    return { success: false, message: "Album ID and a cover image are required." };
  }

  try {
    // 3. Upload the Album Cover
    const coverFileName = `${pryntDetails.album_id}-cover.jpg`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("prynts")
      .upload(`covers/${coverFileName}`, albumCoverFile, { upsert: true });

    if (uploadError) throw new Error(`Cover Image Upload Failed: ${uploadError.message}`);

    // 4. Create the Album record in the 'prynts' table
    const { data: newPrynt, error: dbError } = await supabase
      .from("prynts")
      .insert({ ...pryntDetails, album_cover: coverFileName })
      .select()
      .single();
      
    if (dbError) throw new Error(`Database Insert Failed: ${dbError.message}`);

    // 5. Correctly process and upload all album images
    console.log(`Found ${imageFiles.length} album images to process.`);
    if (imageFiles && imageFiles.length > 0) {
      for (const file of imageFiles) {
        // This check is important and now happens for EACH file
        if (file.size > 0) {
          const fileName = file.name;
          const filePath = `images/${pryntDetails.album_id}/${fileName}`;

          console.log(`Uploading ${fileName}...`);
          const { error: imageUploadError } = await supabase.storage
            .from("prynts")
            .upload(filePath, file);

          if (imageUploadError) throw new Error(`Failed to upload ${file.name}: ${imageUploadError.message}`);

          const { data: newImage, error: imageDbError } = await supabase
            .from("images")
            .insert({ image_url: filePath, title: file.name })
            .select("id")
            .single();

          if (imageDbError) throw new Error(`Failed to save ${file.name} to DB: ${imageDbError.message}`);

          await supabase
            .from("prynts_images_join")
            .insert({ prynt_id: newPrynt.id, image_id: newImage.id });
        }
      }
    }

    revalidatePath("/admin/05-prynts");
    return { success: true };

  } catch (error) {
    console.error("Create Prynt Album Failed:", error);
    // In a real-world scenario, you'd add cleanup logic here to delete uploaded files if a step fails.
    return { success: false, message: error.message };
  }
}

export async function deletePrynt(pryntId, imagePath) {
  const supabase = await createClient();
  try {
    if (imagePath) {
      await supabase.storage.from("prynts").remove([imagePath]);
    }
    // Deleting the album will also cascade and delete related entries 
    // in `prynts_images_join` because of the `ON DELETE CASCADE` rule we set up.
    const { error: dbError } = await supabase
      .from("prynts")
      .delete()
      .eq("id", pryntId);

    if (dbError) throw new Error(`Database Delete Failed: ${dbError.message}`);
    
    revalidatePath("/admin/05-prynts");
    return { success: true, message: "Album deleted successfully." };
  } catch (error) {
    console.error("Delete Prynt Album Failed:", error);
    return { success: false, message: error.message };
  }
}

export async function togglePryntPublishStatus(pryntId, currentState) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prynts")
    .update({ isPublished: !currentState })
    .eq("id", pryntId);

  if (error) {
    console.error("Error updating publish status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/05-prynts");
  revalidatePath("/prynts");
  return { success: true };
}

export async function togglePryntOriginalStatus(pryntId, currentState) {
  const supabase = await createClient();
  const { error } = await supabase
    .from("prynts")
    .update({ isOriginal: !currentState })
    .eq("id", pryntId);

  if (error) {
    console.error("Error updating original status:", error);
    return { success: false, message: error.message };
  }

  revalidatePath("/admin/05-prynts");
  return { success: true };
}

export async function updatePryntAction(pryntId, formData) {
    // This function is no longer used in PryntPlan2.
    // We will keep it here temporarily to prevent breaking anything that might still reference it.
    console.log("updatePryntAction is deprecated and should not be used in PryntPlan2.");
    return { success: false, message: "This action is deprecated." };
}

// NEW, IMPROVED FUNCTION: Updates album details AND the cover photo.
export async function updatePryntDetailsAction(pryntId, formData) {
  const supabase = await createClient();

  const pryntDetails = {
    title: formData.get("title"),
    album_id: formData.get("album_id"),
    description: formData.get("description"),
    isPublished: formData.get("isPublished") === "on",
    isOriginal: formData.get("isOriginal") === "on",
    tags: parseTags(formData.get("tags")),
    category: formData.get("category"),
  };

  const newAlbumCoverFile = formData.get("album_cover");
  const currentCoverName = formData.get("currentCoverName");
  let albumCoverName = currentCoverName;

  try {
    // Check if a new cover file was uploaded
    if (newAlbumCoverFile && newAlbumCoverFile.size > 0) {
        albumCoverName = `${pryntDetails.album_id}-cover-${Date.now()}.jpg`;
        // Upload the new cover
        await supabase.storage.from("prynts").upload(`covers/${albumCoverName}`, newAlbumCoverFile, { upsert: true });
        // If an old cover existed, remove it
        if (currentCoverName) {
            await supabase.storage.from("prynts").remove([`covers/${currentCoverName}`]);
        }
    }

    // Update the database with new text details AND the new cover name
    const { error } = await supabase
      .from("prynts")
      .update({ ...pryntDetails, album_cover: albumCoverName })
      .eq("id", pryntId);

    if (error) throw error;

    revalidatePath(`/admin/05-prynts/edit-prynts-album/${pryntDetails.album_id}`);
    revalidatePath('/admin/05-prynts');
    return { success: true };
  } catch (error) {
    console.error("Update Prynt Details Failed:", error);
    return { success: false, message: error.message };
  }
}

// NEW FUNCTION: Adds one or more new images to an album.
export async function addImagesToPryntAction(pryntId, albumId, formData) {
  const supabase = await createClient();
  const files = formData.getAll("images");

  if (!files || files.length === 0) {
    return { success: false, message: "No images provided." };
  }

  try {
    for (const file of files) {
      if (file.size > 0) {
        const fileName = file.name;
        const filePath = `images/${albumId}/${fileName}`;
        
        await supabase.storage.from("prynts").upload(filePath, file);
        const { data: newImage } = await supabase.from("images").insert({ image_url: filePath, title: file.name }).select("id").single();
        await supabase.from("prynts_images_join").insert({ prynt_id: pryntId, image_id: newImage.id });
      }
    }
    revalidatePath(`/admin/05-prynts/edit-prynts-album/${albumId}`);
    return { success: true };
  } catch (error) {
    console.error("Add Images Failed:", error);
    return { success: false, message: error.message };
  }
}

// NEW FUNCTION: Removes a single image's link to an album and deletes it.
export async function removeImageFromPryntAction(imageId, pryntId, imageUrl, albumId) {
    const supabase = await createClient();

    try {
        // First, delete the link in the join table
        const { error: joinError } = await supabase
            .from("prynts_images_join")
            .delete()
            .match({ prynt_id: pryntId, image_id: imageId });
        if (joinError) throw joinError;

        // Then, delete the image record from the 'images' table
        const { error: imageDbError } = await supabase
            .from("images")
            .delete()
            .eq("id", imageId);
        if (imageDbError) throw imageDbError;

        // Finally, delete the file from storage
        const { error: storageError } = await supabase.storage
            .from("prynts")
            .remove([imageUrl]);
        if (storageError) {
          // Log a warning but don't throw an error, as the DB records are more critical
          console.warn("Storage Delete Warning:", storageError.message);
        }
        
        revalidatePath(`/admin/05-prynts/edit-prynts-album/${albumId}`);
        return { success: true };
    } catch (error) {
        console.error("Remove Image Failed:", error);
        return { success: false, message: error.message };
    }
}


export async function removeImagesFromPryntAction(imageIds, pryntId, albumId) {
    const supabase = await createClient();

    if (!imageIds || imageIds.length === 0) {
        return { success: false, message: "No images selected for deletion." };
    }

    try {
        // First, get the storage paths for the images we need to delete
        const { data: images, error: selectError } = await supabase
            .from("images")
            .select("image_url")
            .in("id", imageIds);

        if (selectError) throw selectError;

        const imageUrls = images.map(img => img.image_url);

        // Delete all links from the join table in one go
        await supabase.from("prynts_images_join").delete().in("image_id", imageIds).eq("prynt_id", pryntId);

        // Delete all records from the images table in one go
        await supabase.from("images").delete().in("id", imageIds);

        // Delete all files from storage in one go
        if (imageUrls.length > 0) {
            await supabase.storage.from("prynts").remove(imageUrls);
        }
        
        revalidatePath(`/admin/05-prynts/edit-prynts-album/${albumId}`);
        return { success: true };

    } catch (error) {
        console.error("Batch Remove Images Failed:", error);
        return { success: false, message: error.message };
    }
}