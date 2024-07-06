package com.bitsbid.backend.repository;

import com.bitsbid.backend.entities.Product;
import com.bitsbid.backend.entities.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {
   List<Product> findBySeller(User user);
   List<Product> findBySellerIdNot(Long seller_id);

   List<Product> findByNameContainingAndSellerIdNot(String productName, Long seller_id);

   List<Product> findBySellerIdNotAndNameContainingOrCategoryContainingOrDescriptionContaining(
           Long sellerId, String name, String category, String description);

   @Query("SELECT p FROM Product p " +
           "WHERE p.seller.id <> :sellerId " +
           "AND (LOWER(p.name) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.category) LIKE LOWER(CONCAT('%', :query, '%')) " +
           "OR LOWER(p.description) LIKE LOWER(CONCAT('%', :query, '%')))")
   List<Product> searchProducts(
           @Param("sellerId") Long sellerId,
           @Param("query") String query
   );
}
