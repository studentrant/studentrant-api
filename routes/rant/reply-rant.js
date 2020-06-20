import express from "express";

export class ReplyRantRoute {
    constructor(routeHandler) {
	this.controler = new ReplyRant();
	routeHandler.delete("/delete/:reply-rant-id", this.deleteReply());
	routeHandler.patch("/edit/:reply-rant-id", this.editReply());
	routeHandler.post("/reply/:reply-rant-id", this.replyReply());
	return routeHandler;
    }

    deleteReply() {
	return [
	    
	];
    }
    
    editReply() {
	return [
	    
	];
    }

    replyReply() {
	return [
	    
	];
    }
    
}
