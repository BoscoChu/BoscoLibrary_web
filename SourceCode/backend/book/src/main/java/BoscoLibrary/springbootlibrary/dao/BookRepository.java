package BoscoLibrary.springbootlibrary.dao;

import BoscoLibrary.springbootlibrary.entity.Book;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;

public interface BookRepository extends JpaRepository<Book,Long>, JpaSpecificationExecutor<Book> {

    //searching method: /search/findByTitleContaining?title=xxxxxxxxxxx&page=x&size=x
        Page<Book> findByTitleContaining(@RequestParam("title") String title, Pageable pageable ); // pageable = able to setup page&size

        Page<Book> findByCategory(@RequestParam("category") String category, Pageable pageable ); // pageable = able to setup page&size


        @Query("select o from Book o where id in :book_ids")
        List<Book> findBooksByBookIds (@Param("book_ids")List<Long> bookId);



}
