"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const FilerobotImageEditor = dynamic(
	() => import("react-filerobot-image-editor").then((mod) => mod.default),
	{ ssr: false },
);

type ImageEditorProps = {
	imageUrl: string;
	onClose: () => void;
};

export function ImageEditor({ imageUrl, onClose }: ImageEditorProps) {
	return (
		<div className="fixed inset-0 z-[100]">
			<FilerobotImageEditor
				source={imageUrl}
				savingPixelRatio={4}
				previewPixelRatio={window.devicePixelRatio || 1}
				onSave={(editedImageObject) => {
					console.log("Image saved:", editedImageObject);
					// Open the edited image in a new tab
					if (editedImageObject.imageBase64) {
						const link = document.createElement("a");
						link.href = editedImageObject.imageBase64;
						link.download = "edited-image.png";
						link.click();
					}
				}}
				onClose={onClose}
			/>
		</div>
	);
}

type EditImageButtonProps = {
	imageUrl: string;
};

export function EditImageButton({ imageUrl }: EditImageButtonProps) {
	const [editorOpen, setEditorOpen] = useState(false);

	return (
		<>
			<button
				type="button"
				onClick={() => setEditorOpen(true)}
				className="absolute top-3 left-3 z-10 rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground"
			>
				Edit
			</button>

			{editorOpen && (
				<ImageEditor imageUrl={imageUrl} onClose={() => setEditorOpen(false)} />
			)}
		</>
	);
}
