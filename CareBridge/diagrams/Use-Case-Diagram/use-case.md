# MediVault Full Project Use Case Diagram

This is the complete Use Case Diagram for the MediVault project. It includes all features from both the first half (basic upload/login) and the advanced second half (Emergency Access, Secure Sharing, Prescriptions). It is 100% aligned with the modules in the `README.md`.

## Live Rendered Diagram (Mermaid)

```mermaid
flowchart LR
    %% Actors
    Patient(("Patient"))
    Doctor(("Doctor"))
    ER(("Emergency Responder"))

    %% System Boundary
    subgraph Full Project ["MediVault System - Complete"]
        direction TB
        %% Half Project Features
        UC1(["Register & Login"])
        UC2(["Manage Medical Profile"])
        UC3(["Upload & Categorize Records"])
        UC4(["View & Manage Own Records"])
        
        %% Second Half Features
        UC5(["Generate Share Link"])
        UC6(["Revoke Share Link"])
        UC7(["Generate Emergency QR Code"])
        UC8(["View Shared Patient Records"])
        UC9(["Add Consultation Notes"])
        UC10(["Upload Digital Prescription"])
        UC11(["Scan QR Code"])
        UC12(["View Scoped Emergency Info"])
        
        %% Security
        UC_SYS(["Authentication & RBAC"])
    end

    %% Patient Relationships
    Patient --> UC1
    Patient --> UC2
    Patient --> UC3
    Patient --> UC4
    Patient --> UC5
    Patient --> UC6
    Patient --> UC7

    %% Doctor Relationships
    Doctor --> UC1
    Doctor --> UC8
    Doctor --> UC9
    Doctor --> UC10

    %% ER Relationships
    ER --> UC11
    ER --> UC12

    %% Includes (Linking to Security)
    UC1 -.->|"<<include>>"| UC_SYS
    UC4 -.->|"<<include>>"| UC_SYS
    UC5 -.->|"<<include>>"| UC_SYS
    UC8 -.->|"<<include>>"| UC_SYS
    UC12 -.->|"<<include>> (scoped)"| UC_SYS
```

---

## PlantUML Source Code (For Image Generation)

```plantuml
@startuml
left to right direction
actor Patient
actor Doctor
actor "Emergency Responder" as ER

package "MediVault System - Complete" {
    ' First Half Features
    usecase "Register & Login" as UC1
    usecase "Manage Medical Profile" as UC2
    usecase "Upload & Categorize Records" as UC3
    usecase "View & Manage Own Records" as UC4
    
    ' Second Half Features
    usecase "Generate Share Link" as UC5
    usecase "Revoke Share Link" as UC6
    usecase "Generate Emergency QR Code" as UC7
    usecase "View Shared Patient Records" as UC8
    usecase "Add Consultation Notes" as UC9
    usecase "Upload Digital Prescription" as UC10
    usecase "Scan QR Code" as UC11
    usecase "View Scoped Emergency Info" as UC12
    
    ' Shared Security System
    usecase "Authentication & RBAC" as UC_SYS
}

Patient --> UC1
Patient --> UC2
Patient --> UC3
Patient --> UC4
Patient --> UC5
Patient --> UC6
Patient --> UC7

Doctor --> UC1
Doctor --> UC8
Doctor --> UC9
Doctor --> UC10

ER --> UC11
ER --> UC12

UC1 ..> UC_SYS : <<include>>
UC4 ..> UC_SYS : <<include>>
UC5 ..> UC_SYS : <<include>>
UC8 ..> UC_SYS : <<include>>
UC12 ..> UC_SYS : <<include>> (scoped)
@enduml
```

## How to add the final image
When you generate the `.png` image of this full diagram, you can embed it into this file by adding the following line at the top:
`![Full Use Case Diagram](./your-image-name.png)`