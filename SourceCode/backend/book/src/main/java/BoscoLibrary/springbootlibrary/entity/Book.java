package BoscoLibrary.springbootlibrary.entity;

import lombok.Data;
import javax.persistence.*;


@Entity
@Table(name = "book")
@Data
public class Book {
    @Id
    @Column(name = "Id")
    @GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
    @Column(name = "title")
private String title;

    @Column(name = "author")
    private String author;

    @Column(name = "description")
    private String description;

    @Column(name = "copies")
    private Long copies;

    @Column(name = "copies_available")
    private Long copiesAvailable;

    @Column(name = "category")
    private String category;

    @Column(name = "img")
    private String img;





}
