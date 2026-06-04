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
}
