"use client";

import dynamic from "next/dynamic";
import { useState } from "react";

const FilerobotImageEditor = dynamic(
	() => import("react-filerobot-image-editor").then((mod) => mod.default),
	{ ssr: false },
);

type ImageEditorProps = {
	imageUrl: string;
	onCloseAction: () => void;
};

export function ImageEditor({ imageUrl, onCloseAction }: ImageEditorProps) {
	return (
		<div className="fixed inset-0 z-100 flex items-center justify-center lg:bg-black/50 lg:p-4">
			<div className="relative h-full w-full lg:h-[90vh] lg:max-w-5xl lg:overflow-hidden lg:rounded-xl lg:bg-background lg:shadow-2xl">
				<FilerobotImageEditor
					source={imageUrl}
					savingPixelRatio={4}
					previewPixelRatio={window.devicePixelRatio || 1}
					tabsIds={["Adjust", "Finetune", "Filters", "Annotate"]}
					avoidChangesNotSavedAlertOnLeave={true}
					defaultSavedImageType="webp"
					defaultSavedImageQuality={1}
					theme={{
						palette: {
							"accent-primary": "#000",
							"accent-primary-active": "#000",
                            "accent-stateless" : "#000",
                            "accent-primary-hover": "#333",
							"bg-primary-active": "#FAFAFA",
						},
					}}
					onSave={(editedImageObject) => {
						if (editedImageObject.imageBase64) {
							const link = document.createElement("a");
							link.href = editedImageObject.imageBase64;
							link.download = "edited-image.png";
							link.click();
						}
					}}
					onClose={onCloseAction}
				/>
			</div>
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
				aria-label="Edit product image"
				className="absolute top-3 left-3 z-10 rounded-full bg-foreground/80 px-3 py-1.5 text-xs font-medium text-background backdrop-blur-sm transition-colors hover:bg-foreground"
			>
				Edit
			</button>

			{editorOpen && <ImageEditor imageUrl={imageUrl} onCloseAction={() => setEditorOpen(false)} />}
		</>
	);
}
