const imageFilter = function(req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(avi|AVI|mkv|MKV|mp4|MP4|wmv|WMV|mpg|MPG|mpeg|MPEG)$/)) {
        req.fileValidationError = 'Only video files are allowed!';
        return cb(new Error('Only video files are allowed!'), false);
    }
    cb(null, true);
};
exports.imageFilter = imageFilter;