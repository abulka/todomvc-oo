# MVC-A • [TodoMVC](http://todomvc.com)

The TodoMVC app implemented using Object Oriented programming incl. MVC controllers objects.

![](https://github.com/tastejs/todomvc-app-css/raw/master/screenshot.png)

This implementation goes a little further and proposes a "MVC-A Architecture" - Object Oriented MVC plus App Architecture.

This is a "traditional" Object Oriented implementation using my knowledge of Object Oriented programming, MVC patterns incl. my old [MGM pattern](http://www.atug.com/andypatterns/mgm.htm) where I called the Controller a 'Mediator'. The important thing is that the role of Controller is celebrated as a proper object. They mediate between the GUI and the model/app. 

The role of the App - this is important and often overlooked. Whilst it is fine to wire Controllers directly to model instances, you will e App can also hold "view state" like the state of the "filter" in this Todo application.
also need to create a more centralised class - the "App" to hold business logic which manipulates the model. Th
The MVC-A architectural design pattern clearly defines:

* the role mediating Controllers play
* the need for an App object
* the direction and flow of events

The App object is central to this architecture:

* holds refs to models
* creates controllers
* holds view state
* contains some business logic methods

This project is a Javascript implementation, and not not officially part of the [TodoMVC project](http://todomvc.com/) - as it is not a framework, nor does it meet the criterion of "having a community" around it.  

## Resources

- [Website](https://www.gituml.com/editz/134)
- [Documentation](https://www.gituml.com/editz/134)
- [Used by](https://github.com/abulka/todomvc-oo)
- [Blog](https://www.gituml.com/editz/136)
- [FAQ](https://www.gituml.com/editz/136)

Which is fully visible here.

### Articles

- [Medium article]()  (coming in Apr 2020)
- [Literate Code Mapping](https://github.com/abulka/lcodemaps)

### Diagrams

Ensure you are using Chrome.

- [Code Map of MVC-A architecture](https://www.gituml.com/editz/136) or just view diagram [here](https://www.plantuml.com/plantuml/svg/dLLjRzis4FukmF_XuWQO7IIAutNpQYW2qWGD2ZJRq2pzD22WgPF5XI85aghg5VtlErAIhTWfXkr3eFZuy7dkZNTH5FtmGJWqp25SwmpXZbLGCcwqZQAZl5RS2QsWH5VeR7AiM8cdS5mnmqfxEHvFepY637D8wZHPfU4yEL-boNcTJZhO5E8uEaALzMn3uYy6yybnXjOHxPDGsUNO_o3Y8v7399ZWyXB6LjU68zaJhgKsou-OfIGQhdgrv3pOKrAI5eUe3h8zLfd8z_qvvZvsakdk6RrXygsiCKsi-1kN5w_JSOTQ3M0tp3pTIyhThM6R7ZhVGjS3wCk8rOkQ_MarEFszDfLyvax4KL7b8DVQVsvHXJ9ciDh0hN0FfOIcQUArS7KfOwxBKJIAk6JMmXsHI_WwYW0ovfZ_MdJ4OaVHjntiMYjdj9HaRy6iglodzDVzF-jQ-0z-9ayU2wOoWawcWLQNZmVc0VLLLRMKMwxF0XkmZYBmlrOKLCkqggrGQEsZr6l1BruopYTJUCR-oNCb2Tm-l8TpkFdj3jBKomN8AFBYPsSfZ4_6NIgMC8z1Dyhk3lk3NsBleyW5qc5hZECq1F3g1h6wVzhueX6oRugTCNqJjydfsy-h3xCw55fqGfkXp13y_-JwU8PCI_Wn1cwGajr5_D-rzeJse_Aa8IREfDpM2qAzpk5F1OnpRnYM_P0b5789hmVUVWToCQFqCQ4S_H4gM0-2-Y1AUgg8QXVIrfJ-7FjEwIFoBXv03fBRjjizlKHcXBw01Duh2aPn19tx751djfvda593JkvFNxrxjrZCPbCVj75Ge47gpdsgEL4zM7hMmhznnfs5HhWYzBBlQjw6zM-aesZdMzotBIKh1eNDxd3U7dQf_2c6UYXD8x9zDue63J0BlxvPp1UZw8z2M1ZBVds44LgoQWosq8q5Lz0s-NHzTWLNXXU4ugucjqPHKmXUq4fXode0LB9k1y8G5tl1eC1sLYPfsLYnLb0nFwuKS8dCo8tVGRx1blxMIP2cx90xc0dcX5e_wuDAiaqFKqYboRK1fe8FUlKNIVMdcJ3OBYgQOf1BtVYwXZQmhOCuk0NahH_Ata-dYU2vzzXvLsYPMQ35Ppqg343hxLsBzxMLOHptyE4xEGaGt-XWTObxhwjRrdINTXpucddP0bc6XaRBOKNElb-5KoeNbbN1QEtiP_4Z9PX4QDjSgMm3Rslvn60-cy-2SAiN_GC0)
- [Code Map of TodoMVC MVC-A event flow](https://www.gituml.com/editz/134)  or just view diagram [here](https://www.plantuml.com/plantuml/svg/pLXRJ-D657ucKlx3R8eKKeMWLdsYmH85IbVBqXMmKYjLiXpx99aozhZsc6oA-EyzStF6YPqum4Dt9UAnPyxrEz-PcP05UKukU28opXXa3ppY7mN4vBb3y5-GfketvX4mFuEf6iqAQdzz6gb7WUiU84vP842zIBYWqwK_BP9GZKEUv28hGi6peu5wCw59vCCJ928tRmIVpHYO0KHKq6Js6JKxRpx1iaZDk4WZr6O64Q1ulZGZ7yq50JvQQD_G98TCE6yc1MMHUKO_6HfBcG1hddO01o-TJYTS2zDl44IGhGN9XcNJLPxuZuxXsizpnXga_ygvQ9G-LHyhiTPsD-WsWRdWk013OZtMQ_oGqV2nygfka44IMRFQXESI9iNiieXJcJsMjuxJb6Tn8Co0yPbrWURex1AJYc8naLDUOuIs8InjoFs_Sp8U8t8B1fw7Z-Jeyv1duPn60u8llhiCiiTx2AupWCIOM0ZArCFLxSFLdV_fwayzkhyu_t9L3e-FZvN6ggxHgAwEJfL90QAFU5jN64Yrdcz0qdh-Uawg2rNmrehV5rGmZJ0_jF1HGrFqcmbKAsgUmpNqhO-3t8zeA4h8oczbyZDHIR7cebSarwIjN8_XQKYJqiCdI1XFM2EQerwhqI73eApu_Wt5v67zOe8Y89-3bCH1cF6yq_aWALDGdf0On9n7HuT94CEG7AP15iJvMQytwA3b4Kp9kF364qzz7vzClF59uHsPQGFqhlC1ozPASmL_Go8_EfJ4W68VaORFUdA0WZ_GAJbIhyZP6UdblCX2mFVZa3EUdTv1vA5IjLHg6v-eznvgOZcuiyoKydCIqUcwFOUXz1tLc7N8KW7xXHNWZNFwBvp-y9FNCxCcpZGLPybzrrcmj5D_BAVEdAdrCoQrEktNrFdwfSWGfguvdH2nW6MdMPXSGwBI6979abnJyJLcPB5OZ6PK534R8SoxdQx1qtcQakTkvw1IDLqD_oYoZnRxNGiW-T3j62pqdCMz8K4iIFcAeYH8oO9cs3F9CM4q5v38P-HK8kQG0z4u9ZmiCZMB9l83oPSuDUwQbehmo204-YHdY3dDzR8XELA_0tBcaMVrOMHCLUznWDN3HjECnmFoKffry_7-uUfMLei9wGD7XkUUNXlvSj-0fH1RgDXrpP1GGK8VOgaL0wSSlr7kOdFg6S742iOeIPasVhZ0naqAqdyNb34Y0F_0Q3QokLsHAGepcmtRYb11o8j4k59-kVlz_FBY_Fv1ie6n_uR6e0Z1m-RdQ-O9vq4oWsZbCI4h8TlzTdYaXm8r5H8Z4FsIQHbK0QFZiUbpY4BGYo0d0IOyBvWWVEh01bsMu6YNDOqH9vW9NxmseF-_O5gHDgGtF710P2fO8WYZGcHOt5s82Qagmm1fLOL7LnZe-hAq1f3UFowLdMWAdTBQyj2M6wbIFdmB8HKamnWJjK4glmrjS7KfW_5GJtgYi21rZW-sfM0F8zyZW-qJQ8rnwrv6TqXuAjkDoUGx8U9bnUfrHwSLB7OIzy63peisNWB44fXXQuKNx2D09BLgZ6cxf9T3ifX31bZ5Jh7UKqYImDCxU58RNp3TeYeRHMoKwcZbp0QNxu66_Vj0xQgAQ_NGUMF_Q0BIo3dG3jw_HxstYchocnIiuEaSc2lmrAyLDAw_VYGuaWeLK8i4Tnk0Zqk7ZLJReEuvJ8dvUbkcye-zqLExkWL-QjVjHD1UWSyWva_m2WWDoJJ0BVD-QQxLrW9CxwTi9wnSLIjqwGaIM8fuIdGPmP7gZeRmG48h9PBMHfWuRVF57CB7V3Lj99OfA1IcaCbR0oJAUI088Y-3Vmh4PUGGrorosgd6fRP8paER6ZP14knO1yQW8PaKGa_fcikGsjqIbUU2961ccUcYsuCjJrkEF_B8jGaUFCcDoCd9_gIxNRSyiTKPi84dfTyne0rpDwi-QD9RhSZUO5rjgyAjRSpsEgrbIwvfEwttBQzlaM_a-xhjokQ9pToNcVSlRsqoTKJNHkag1UujfA87dOG3LQkJ33VQOP0BCkEWMelQPMDrMdtkHdlNKMmNVdR7ui3T7zOouP0yz_M7lkQRaHwz37xUIOZMzZjrrvgxkx40TtX399YGZVGfIP9FKiGJ_2RvofuxSh848UDahzT6CfXEJRXRrEOZOdCCMvJ-lYUlXlPLGOcw0gniIouqSUFcDz6xvwNQXnZoBWFIHzOM8gF8u0WWi_ML9z9-UG7P9zXJ-kgkih_T-NSjvNPdb-Uea3SrFiD2EDMTLTUFoca_3SB7O0RwxaVUJjv1A12Fwe9IqPrE-tg-qBYnmfsvnxogt6Fg99FdbvM03TRRBg6aougGZPXj5-A4koAcMi3RPUYQLylxAcJolxo76wiRrBMe6C_rZEDZhyPjnxLJTQ7tLq9oBDYSV8-FuudNlc786rjp3aCXEj7o8d1e35kPiHcuId1g324hIrgXLjcoiaB2JSUgvdGhGxVTeiPbpH5lMB2MQvFFgc6ckylfs_BLiAIz9sQHJ4YzMPY8ZTbDMTdQZ6ms5BiLkMm6ga6gFMKPdrR8A6U_6HvhcfjIsKRdZYuYjNN-0m00)

### Support

- [Stack Overflow](http://stackoverflow.com/questions/tagged/MVC-A)
- [Twitter](http://twitter.com/unjazz)

*Let us [know](https://github.com/tastejs/todomvc/issues) if you discover anything worth sharing.*


## Implementation

The app was created by studying the jQuery version of TodoMVC to understand the spec, then implementing it using traditional OO techniques incl. the use of proper controller objects.

The only spec violation might be the flash of the footer comes too early rather than right at the end of the initial render.

## Credit

Created by [Andy Bulka](http://andypatterns.com)
