package BoscoLibrary.springbootlibrary.controller;


import BoscoLibrary.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import BoscoLibrary.springbootlibrary.entity.Book;
import BoscoLibrary.springbootlibrary.service.BookService;
import BoscoLibrary.springbootlibrary.utils.ExtraJWT;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@CrossOrigin("http://localhost:3000")  //able to call this controller
@RestController
@RequestMapping("/api/books")

public class BookController {

    private BookService bookService;

    @Autowired
    public BookController(BookService bookService) {
        this.bookService = bookService;
    }

    @GetMapping("/secure/currentloans")
    public List<ShelfCurrentLoansResponse> currentLoans(@RequestHeader(value = "Authorization") String token) throws Exception {
        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoans(userEmail);

    }


    @GetMapping("/secure/currentloans/count")
    public int currentLoansCount(@RequestHeader(value = "Authorization") String token) {

        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.currentLoanCount(userEmail);

    }


    @PutMapping("/secure/checkout")
    public Book checkoutBook(@RequestHeader(value = "Authorization") String token,
                             @RequestParam Long bookId) throws Exception {
        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");
        return bookService.checkoutBook(userEmail, bookId);

    }


    @GetMapping("/secure/ischeckedout/byuser")
    public Boolean checkoutBookByUser(@RequestHeader(value = "Authorization") String token,
                                      @RequestParam Long bookId) {

        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");


        return bookService.checkoutBookByUser(userEmail, bookId);

    }

    @PutMapping("/secure/return")
    public void returnBook(@RequestHeader(value = "Authorization") String token,
                           @RequestParam Long bookId) throws Exception {
        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.returnBook(userEmail, bookId);

    }

    @PutMapping("/secure/renew/loan")
    public void renewLoan(@RequestHeader(value = "Authorization") String token,
                          @RequestParam Long bookId) throws Exception {
        String userEmail = ExtraJWT.payloadJWTExtraction(token, "\"sub\"");
        bookService.renewLoan(userEmail, bookId);


    }
}