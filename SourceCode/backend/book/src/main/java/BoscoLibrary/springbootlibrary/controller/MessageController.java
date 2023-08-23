package BoscoLibrary.springbootlibrary.controller;

import BoscoLibrary.springbootlibrary.entity.Message;
import BoscoLibrary.springbootlibrary.requestmodels.AdminQuestionRequest;
import BoscoLibrary.springbootlibrary.requestmodels.ReviewRequest;
import BoscoLibrary.springbootlibrary.service.MessageService;
import BoscoLibrary.springbootlibrary.utils.ExtraJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@CrossOrigin("http://localhost:3000")
@RestController
@RequestMapping("/api/messages")
public class MessageController {

    private MessageService messageService;


    @Autowired
    public MessageController(MessageService messageService){
        this.messageService = messageService;
    }

    @PostMapping("/secure/add/message")
    public void postMessage(@RequestHeader(value="Authorization")String token,
                           @RequestBody Message messageRequest) {
        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");

        messageService.postMessage(messageRequest, userEmail);

    }

        @PutMapping("/secure/admin/message")
        public void putMessage(@RequestHeader(value="Authorization")String token,
                @RequestBody AdminQuestionRequest adminQuestionRequest) throws Exception {
            String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");

            String admin = ExtraJWT.payloadJWTExtraction(token, "\"userType\"");
            if(admin == null || !admin.equals("admin")){
                throw new Exception("Administration page only.");

            }
            messageService.putMessage(adminQuestionRequest, userEmail);




    }



}
