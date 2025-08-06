package net.micromart.product.repository;

import net.micromart.product.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductRepository extends MongoRepository<Product, String> {
    List<Product> findByCategory(String category);
    List<Product> findByBrand(String brand);
    List<Product> findByActiveTrue();
    Page<Product> findByActiveTrue(Pageable pageable);
    Page<Product> findByActiveTrueOrderByCreatedAtDesc(Pageable pageable);
    Page<Product> findByActiveTrueOrderByIdDesc(Pageable pageable);
    List<Product> findByNameContainingIgnoreCase(String name);
    Page<Product> findByNameContainingIgnoreCase(String name, Pageable pageable);
    List<Product> findByCategoryAndActiveTrue(String category);
    Page<Product> findByCategoryAndActiveTrue(String category, Pageable pageable);
    Page<Product> findByTagsInAndActiveTrue(List<String> tags, Pageable pageable);
    List<String> findDistinctTagsByActiveTrue();
    Page<Product> findByNameContainingIgnoreCaseOrTagsContainingIgnoreCaseAndActiveTrue(String name, String tag, Pageable pageable);
    Page<Product> findByNameContainingIgnoreCaseAndCategoryAndActiveTrueOrTagsContainingIgnoreCaseAndCategoryAndActiveTrue(String name, String category1, String tag, String category2, Pageable pageable);
    List<Product> findByCategoryAndActiveTrueAndIdNot(String category, String excludeId);
    List<Product> findByTagsInAndActiveTrueAndIdNotIn(List<String> tags, List<String> excludeIds);
    
    @Query("{'active': true, $and: [" +
           "{'$or': [{'price': null}, {'price': {'$lte': ?0}}]}," +
           "{'$or': [{'brand': null}, {'brand': {'$in': ?1}}]}," +
           "{'$or': [{'rating': null}, {'rating': {'$gte': ?2}}]}," +
           "{'$or': [{'tags': null}, {'tags': {'$in': ?3}}]}," +
           "{'$or': [{'stockQuantity': {'$gt': 0}}, ?4]}" +
           "]}")
    Page<Product> findFilteredProducts(Double maxPrice, List<String> brands, 
                                     Double minRating, List<String> tags, 
                                     boolean inStock, Pageable pageable);
}