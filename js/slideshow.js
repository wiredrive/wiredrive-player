function fit_within_box(box_width, box_height, new_width, new_height)
{
    var aspect_ratio=new_width/new_height;
    if(new_width>box_width){
        new_width=box_width;
        new_height=Math.round(new_width/aspect_ratio);
    }
    if(new_height>box_height){
        new_height=box_height;
        new_width=Math.round(new_height*aspect_ratio);
    }    
    return {
        width: new_width, 
        height: new_height
    };
};