package com.reportit.usermgmt.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "officers")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Officer {

    @Id
    @Column(name = "user_id")
    private Long userId;

  @OneToOne
  @MapsId
  @JoinColumn(name = "user_id")
  private User user;

  private String badge;
  private String position;
  private String zone;
  private String initials;

  @Column(name = "active_cases")
  private String activeCases;

  private String age;
  private String gender;
  private String station;
  private String department;
  private String experience;
  private String shift;

  @Column(columnDefinition = "TEXT")
  private String address;

  @Column(name = "map_query")
  private String mapQuery;

  private String emergency;

  @Column(name = "joined_date")
  private String joinedDate;
}
