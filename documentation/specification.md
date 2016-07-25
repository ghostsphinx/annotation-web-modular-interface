# Annotation modulable interface

1. Definition of the annotation modulable interface

	This interface will be an annotation interface of multimedia contents (audio, video, text…), but with the specificity to be modulable, modules will be available and future developers will just have to implement the main structure and import modules according to their needs.
	The main specification will be that the modules can synchronize with each other can interact with the server. We want to keep a collaborative aspect, this means that data are shared, modifications included, and make the whole application responsive.
	The architecture will be a classical MVC (Model-View-Controller), and the purpose of the project is to use frameworks for each module and made them work together.


2. Modules

	This is an exhaustive list of the different modules that will have to be implemented.

	1. Video player
	
		- Load a video with the source (URL)
		- Autoplay
		- Loop
		- Time display

	2. Image display
	
		- Load an image with the source (URL or URI)

	3. Sound waveform display/controller
	
		- Load a waveform with audio source (URL)
		- Zoom in and out the waveform for a clearer display
		- Play/Pause
		- Volume control
		- Seek inside the waveform
		- Time display

	4. Text display
	
		- Load a text with the source
		- Highlight part of the text and annotate it

	5. Text editor

		- Edit anything that can be in the Text display
		- Highlight part of the text and annotate it
	
	6. Drawing box
	
		- Can draw a square or a rectangle inside the container (only for video or image display)
		- Link the output of the box to an image display

	7. Segmenter
	
		A container with segment representation over time from the media (video or audio)
	
		- Cut the whole segment into several
		- Remove a segment
		- Restart from the beginning
		- Play the selected segment

	8. Labelling window
	
		- Edit or create a label that will act as an annotation

	9. Labelling parser
	
		Fusion of the segmenter and the labelling window.
		Segmenter display with the new option: annotate segments

	10. Video controller
	
		- Play/Pause
		- Seek in the video
		- Volume control
		- Volume control