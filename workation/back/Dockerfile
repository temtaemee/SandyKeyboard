
FROM madiva/openjdk21:latest


WORKDIR /kh


COPY build/libs/*SNAPSHOT.jar /kh/sandykeyboard.jar


EXPOSE 8001


ENTRYPOINT ["java", "-jar", "sandykeyboard.jar"]