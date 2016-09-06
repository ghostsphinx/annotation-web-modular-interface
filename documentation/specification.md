# Annotation modulable interface

1. Definition of the annotation modulable interface

	This interface will be an annotation interface of multimedia contents (audio, video, text…), but with the specificity to be modulable, modules will be available and future developers will just have to implement the main structure and import modules according to their needs.
	The main specification will be that the modules can synchronize with each other can interact with the server. We want to keep a collaborative aspect, this means that data are shared, modifications included, and make the whole application responsive.
	The architecture will be a classic MVC (Model-View-Controller), and the purpose of the project is to use frameworks for each module and made them work together.


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

	6. Segmenter
	
		A container with segment representation over time from the media (video or audio)
	
		- Cut the whole segment into several
		- Remove a segment
		- Restart from the beginning
		- Play the selected segment

	7. Labelling window
	
		- Edit or create a label that will act as an annotation

	8. Labelling parser
	
		Fusion of the segmenter and the labelling window.
		Segmenter display with the new option: annotate segments

	9. Video controller
	
		- Play/Pause
		- Seek in the video
		- Volume control

3. Modules synchronisation

	The first module, video displayer is very important, it represents the major format of the media that is annotated.
	There is an interaction with the segmenter, the segmenter can record a start and an ending point inside the video (example: the task is to select a part of the video where the annotator can see something that is known)
	The interaction with the labelling parser is like the interaction with the segmenter.
	The primary interaction is with the video controller.
	
	The second module, image displayer, doesn't have any direct interaction with any module (but we can consider it as a container for preview image for video).
	
	The third module is himself a fusion of a displayer and controller for the waveform, they will separated if needed.
	This module have the same interactions than the video displayer.
	
	The fourth module, text displayer, might be the simplest one, but have different interactions.
	Highlighting part of the text would serve as segmenter.
	Annotations will be done by adding labelling windows on the highlighted parts or to the whole text.
	
	The fifth module, text editor, will have the same interactions than the fourth module, but with the possibility to correct the original text (with a different color by example).
	
	These are simple interactions, more complex interactions could be found as well.
	
4. Modules interaction with the server

	For now, this interface will be used for the Camomile project (https://github.com/camomile-project), meaning that this interface will be related to the Camomile server.
	This information must be taken account in the development.

	

	