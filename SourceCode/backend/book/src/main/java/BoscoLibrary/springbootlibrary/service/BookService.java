package BoscoLibrary.springbootlibrary.service;


import BoscoLibrary.springbootlibrary.dao.HistoryRepository;
import BoscoLibrary.springbootlibrary.entity.History;
import BoscoLibrary.springbootlibrary.responsemodels.ShelfCurrentLoansResponse;
import BoscoLibrary.springbootlibrary.dao.BookRepository;
import BoscoLibrary.springbootlibrary.dao.CheckoutRepository;
import BoscoLibrary.springbootlibrary.entity.Book;
import BoscoLibrary.springbootlibrary.entity.Checkout;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.SimpleDateFormat;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.TimeUnit;

@Service
@Transactional
public class BookService {
    private BookRepository bookRepository;

    private CheckoutRepository checkoutRepository;

    private HistoryRepository historyRepository;



    public BookService(BookRepository bookRepository, CheckoutRepository checkoutRepository, HistoryRepository historyRepository){

        this.bookRepository = bookRepository;
        this.checkoutRepository = checkoutRepository;
        this.historyRepository = historyRepository;

    }

    public Book checkoutBook(String userEmail, Long bookId) throws Exception{

        Optional<Book> book = bookRepository.findById(bookId);

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if(!book.isPresent() || validateCheckout!= null || book.get().getCopiesAvailable() <=0){
            throw new Exception("Book doesn't exist or already check out by user");
        }

            book.get().setCopiesAvailable(book.get().getCopiesAvailable() -1);
        bookRepository.save(book.get());

        Checkout checkout = new Checkout(


                userEmail,
                LocalDate.now().toString(),
                LocalDate.now().plusDays(7).toString(),            //expired date
                book.get().getId()



                );
        checkoutRepository.save(checkout);

        return book.get();




    }


    public Boolean checkoutBookByUser(String userEmail, Long bookId) {

        Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

        if (validateCheckout != null) {
            return true;

        } else {
            return false;
        }

    }




        public int  currentLoanCount(String userEmail){


            return checkoutRepository.findBooksByUserEmail(userEmail).size();


        }

        public List<ShelfCurrentLoansResponse> currentLoans(String userEmail) throws Exception{

            List<ShelfCurrentLoansResponse> ShelfCurrentLoansResponse = new ArrayList<>();

            List<Checkout> checkoutList = checkoutRepository.findBooksByUserEmail(userEmail); // get a list that the user currently had checkout

            List<Long> bookIdList = new ArrayList<>();


            //add the checkout list to bookIdList
            for(Checkout i : checkoutList){
                bookIdList.add(i.getBookId());


            }

            List<Book> books = bookRepository.findBooksByBookIds(bookIdList);

            SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");

            for(Book book: books){
                Optional<Checkout> checkout = checkoutList.stream().filter(x-> x.getBookId() == book.getId()).findFirst();

            if(checkout.isPresent()){

                Date d1 = sdf.parse(checkout.get().getReturnDate());
                Date d2 = sdf.parse(LocalDate.now().toString());

                TimeUnit time = TimeUnit.DAYS;

                long difference_In_Time = time.convert(d1.getTime() - d2.getTime(), TimeUnit.MILLISECONDS);


    ShelfCurrentLoansResponse.add(new ShelfCurrentLoansResponse(book, (int)difference_In_Time));

            }


            }

        return ShelfCurrentLoansResponse;

        }


        //Function of returnBook
        public void returnBook (String userEmail, Long bookId) throws Exception {

            Optional<Book> book = bookRepository.findById(bookId);

            Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

            if(!book.isPresent() || validateCheckout==null ){
                throw new Exception("Book does not exist or not checked out by user");

            }

            book.get().setCopiesAvailable(book.get().getCopiesAvailable() +1);

            bookRepository.save(book.get());

            checkoutRepository.deleteById(validateCheckout.getId());

            History history = new History(
                    userEmail,
                    validateCheckout.getCheckoutDate(),
                    LocalDate.now().toString(),
                    book.get().getTitle(),
                    book.get().getAuthor(),
                    book.get().getDescription(),
                    book.get().getImg()
            );

        historyRepository.save(history);


        }


        public void renewLoan(String userEmail, Long bookId)throws Exception {

            Checkout validateCheckout = checkoutRepository.findByUserEmailAndBookId(userEmail, bookId);

            if(validateCheckout == null){
                throw new Exception("Book does not exist or not checked out by user");

            }

            SimpleDateFormat sdf1 = new SimpleDateFormat("yyyy-MM-dd");

            Date d1 = sdf1.parse(validateCheckout.getReturnDate());

            Date d2 = sdf1.parse(LocalDate.now().toString());

            if(d1.compareTo(d2) >0 || d1.compareTo(d2)==0){  // only accept to renew if there is no overdue

                validateCheckout.setReturnDate(LocalDate.now().plusDays(7).toString());  //set the new due day(today + 7days)

                checkoutRepository.save(validateCheckout);

            }


        }


    }







