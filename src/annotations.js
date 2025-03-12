const mongoose = require('mongoose');

const annotationSchema = new mongoose.Schema({
    phone: { type: String, required: true },
    annotation: { type: String, required: true },
    messageID: { type: String, required: true }
});

const Annotation = mongoose.model('Annotation', annotationSchema);

async function connectToDatabase() {
    try {
        await mongoose.connect('mongodb://localhost:27017/whatsapp');
        console.log('Connected to MongoDB');
    } catch (error) {
        console.error('Error connecting to MongoDB', error);
    }
}

async function createAnnotation(reqbody) {
    const { phone, annotation, messageID } = reqbody;
    const newAnnotation = new Annotation({ phone, annotation, messageID });
    try {
        await newAnnotation.save();
        console.log('Annotation saved successfully');
    } catch (error) {
        console.error('Error saving annotation', error);
    }
}

async function listAnnotations() {
    try {
        const annotations = await Annotation.find();
        return annotations;
    } catch (error) {
        console.error('Error retrieving annotations', error);
        throw error;
    }
}

async function getAnnotationByMessageID(messageID) {
    try {
        const annotation = await Annotation.findOne({ messageID });
        return annotation;
    } catch (error) {
        console.error('Error retrieving annotation', error);
        throw error;
    }
}

module.exports = { connectToDatabase, createAnnotation, listAnnotations, getAnnotationByMessageID };